from datetime import datetime
from typing import List

from application.address.address_repository import AbstractAddressRepository
from application.client.client_repository import AbstractClientRepository
from application.order.order_repository import AbstractOrderRepository
from application.requests import OrderRequest
from application.responses import (
    OrderResponse,
    WarehouseResponse,
    OrderSummaryForRegionResponse,
)
from application.truck.truck_repository import AbstractTruckRepository
from application.warehouse.warehouse_repository import AbstractWarehouseRepository
from domain.address import Address
from domain.exceptions import UnableToRealizeOrderError, WrongAmountOfMoneyError
from domain.order import Order


def calculate_total_weight(products: List[dict]) -> float:
    return sum(product["quantity"] for product in products)


def calculate_total_charge(products: List[dict]) -> float:
    return sum(product["price"] * product["quantity"] for product in products)


def get_warehouses_with_available_products(
    warehouses: List[WarehouseResponse], order_products: List[dict]
) -> List[dict]:
    """
    Find warehouses that can supply the demanded products.
    """
    warehouse_availability = []
    for warehouse in warehouses:
        available_products = {}
        warehouse_data = warehouse.model_dump()
        warehouse_id = warehouse_data["id"]

        for product in order_products:
            product_quantities = warehouse_data["product_quantities"]
            product_id = product["product_id"]
            if product_id in product_quantities and product_quantities[product_id] > 0:
                available_products[product_id] = min(
                    product_quantities[product_id], product["quantity"]
                )

        if available_products:
            warehouse_availability.append(
                {
                    "warehouse_id": warehouse_id,
                    "available_products": available_products,
                }
            )

    warehouse_availability.sort(
        key=lambda x: sum(x["available_products"].values()), reverse=True
    )

    sorted_result = [
        {entry["warehouse_id"]: entry["available_products"]}
        for entry in warehouse_availability
    ]

    return sorted_result


def subtract_products_from_order(
    order_products: List[dict], warehouse_products: dict
) -> List[dict]:
    """Subtract products fulfilled by a warehouse from the remaining order."""
    remaining_products = []
    for product in order_products:
        product_id = product["product_id"]
        quantity_needed = product["quantity"]

        if product_id in warehouse_products:
            quantity_supplied = warehouse_products[product_id]
            if quantity_needed > quantity_supplied:
                remaining_products.append(
                    {
                        "product_id": product_id,
                        "quantity": quantity_needed - quantity_supplied,
                    }
                )
        else:
            remaining_products.append(product)

    return remaining_products


class OrderService:
    def __init__(
        self,
        order_repo: AbstractOrderRepository,
        client_repo: AbstractClientRepository,
        warehouse_repo: AbstractWarehouseRepository,
        truck_repo: AbstractTruckRepository,
        address_repo: AbstractAddressRepository,
    ):
        self._warehouse_repo = warehouse_repo
        self._order_repo = order_repo
        self._client_repo = client_repo
        self._truck_repo = truck_repo
        self._address_repo = address_repo

    def add_order(self, order: OrderRequest) -> OrderResponse:
        order_data = order.model_dump()
        delivery_date = order_data["delivery_date"]
        products = order_data["products"]

        total_weight = calculate_total_weight(products)
        total_charge = calculate_total_charge(products)
        if round(total_charge, 2) != round(order_data["amount"], 2):
            raise WrongAmountOfMoneyError(total_charge, order_data["amount"])

        warehouses, trucks = self.assign_warehouses_and_trucks(
            products, total_weight, delivery_date
        )

        order_data["warehouses"] = warehouses
        order_data["trucks"] = trucks

        delivery_address = Address(**order_data["delivery_address"])
        order_data["delivery_address"] = self._address_repo.add_address(
            delivery_address
        ).id

        order_data["order_status"] = "pending"
        order_from_db = self._order_repo.add_order(Order(**order_data))
        order_from_db_data = order_from_db.model_dump()

        order_data["id"] = order_from_db_data["id"]
        order_data["products"] = order_from_db_data["products"]
        self._client_repo.add_order_to_client_db(order_data["id"], order_data["email"])
        self._truck_repo.add_order_to_trucks_db(order_data["id"], trucks)

        return OrderResponse(**order_data)

    def assign_warehouses_and_trucks(
        self, order_products: List[dict], total_weight: float, delivery_date: datetime
    ) -> tuple[List[str], List[str]]:
        warehouses = self._warehouse_repo.get_warehouses()
        available_warehouses = get_warehouses_with_available_products(
            warehouses, order_products
        )

        assigned_warehouses = []
        assigned_trucks = []
        remaining_products = order_products

        for warehouse in available_warehouses:
            warehouse_id = list(warehouse.keys())[0]
            warehouse_products = warehouse[warehouse_id]

            trucks = self.assign_trucks_for_warehouse(
                warehouse_id, remaining_products, delivery_date
            )
            if not trucks:
                continue

            assigned_trucks.extend(trucks)
            assigned_warehouses.append(warehouse_id)
            remaining_products = subtract_products_from_order(
                remaining_products, warehouse_products
            )
            total_weight = calculate_total_weight(remaining_products)

            if total_weight <= 0:
                break

        if total_weight > 0:
            raise UnableToRealizeOrderError()

        return assigned_warehouses, assigned_trucks

    def assign_trucks_for_warehouse(
        self,
        warehouse_id: str,
        order_products: List[dict],
        delivery_date: datetime,
    ) -> List[str]:
        trucks = self._truck_repo.get_trucks_by_warehouse(warehouse_id)
        assigned_trucks = []
        remaining_weight = calculate_total_weight(order_products)

        for truck in trucks:
            truck_data = truck.model_dump()
            truck_capacity = truck_data["lift_capacity"]

            if not self.is_available_on_date(
                truck_data["active_orders"], delivery_date
            ):
                continue

            if remaining_weight == 0:
                break

            if truck_capacity >= remaining_weight:
                assigned_trucks.append(truck_data["id"])
                return assigned_trucks

            remaining_weight -= truck_capacity
            assigned_trucks.append(truck_data["id"])

        return assigned_trucks

    def is_available_on_date(self, orders: List[str], delivery_date: datetime) -> bool:
        delivery_date_str = delivery_date.strftime("%Y-%m-%d")

        for order_id in orders:
            order = self.get_order_by_id(order_id)
            order_delivery_date = order.model_dump()["delivery_date"].strftime(
                "%Y-%m-%d"
            )

            if order_delivery_date == delivery_date_str:
                return False

        return True

    def get_order_by_id(self, order_id: str) -> OrderResponse:
        return self._order_repo.get_order_by_id(order_id)

    def get_orders(self) -> List[OrderResponse]:
        return self._order_repo.get_all_orders()

    def get_list_of_unavailable_dates(self) -> List[str]:
        trucks = self._truck_repo.get_trucks()
        number_of_trucks = len(trucks)
        unavailable_dates = {}
        for truck in trucks:
            truck_data = truck.model_dump()
            order_id_list = truck_data["active_orders"]
            for order_id in order_id_list:
                order_data = self._order_repo.get_order_by_id(order_id).model_dump()
                delivery_date = order_data["delivery_date"]
                formatted_delivery_date = delivery_date.strftime("%Y-%m-%d")
                if formatted_delivery_date in unavailable_dates:
                    unavailable_dates[formatted_delivery_date] += 1
                else:
                    unavailable_dates[formatted_delivery_date] = 1

        unavailable_dates_list = []
        for date in unavailable_dates:
            if unavailable_dates[date] == number_of_trucks:
                unavailable_dates_list.append(date)

        return sorted(unavailable_dates_list)

    def mark_order_as_complete(self, order_id: str) -> OrderResponse:
        if not self._order_repo.update_order_status_db(order_id, "complete"):
            raise Exception("Failed to mark order as complete")
        order = self._order_repo.get_order_by_id(order_id)
        order_data = order.model_dump()
        truck_ids = order_data["trucks"]
        modified_trucks = self._truck_repo.delete_order_from_truck_db(
            order_id, truck_ids
        )
        if modified_trucks != len(truck_ids):
            raise Exception("Failed to mark order as complete")
        return OrderResponse(**order_data)

    def get_orders_report_for_period(
        self, start_date: datetime, end_date: datetime
    ) -> List[OrderSummaryForRegionResponse]:
        return self._order_repo.get_orders_summary_by_region(start_date, end_date)

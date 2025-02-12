import copy
import json
import os
from unittest.mock import AsyncMock, patch, MagicMock

import pytest
from bson import ObjectId
from dotenv import load_dotenv
from starlette.testclient import TestClient

from application.auth.auth_service import AuthService
from application.order.order_service import OrderService
from application.responses import (
    WarehouseResponse,
    OrderResponse,
    TruckResponse,
    AddressResponse,
)
from domain.entities import Entity
from domain.exceptions import InvalidDateType, FailedToUpdateError
from infrastructure.api.main import app
from infrastructure.containers import Container
from infrastructure.mongo.address_repository import AddressRepositoryMongo
from infrastructure.mongo.client_repository import ClientRepositoryMongo
from infrastructure.mongo.order_repository import OrderRepositoryMongo
from infrastructure.mongo.truck_repository import TruckRepositoryMongo
from infrastructure.mongo.warehouse_repository import WarehouseRepositoryMongo

os.environ["MONGO_DATABASE"] = "shop_db_dev"


@pytest.fixture(scope="module")
def jwt_token_admin():
    """Fixture to generate a test JWT token."""
    user_data = {"sub": "test@mail.com", "role": "admin"}
    return AuthService.create_access_token(data=user_data)


@pytest.fixture(scope="module")
def jwt_token_client():
    """Fixture to generate a test JWT token."""
    user_data = {"sub": "test@mail.com", "role": "client"}
    return AuthService.create_access_token(data=user_data)


@pytest.fixture(scope="module")
def test_container(
    mocked_client_repository,
    mocked_warehouse_repository,
    mocked_order_repository,
    mocked_truck_repository,
    mocked_address_repository,
):
    """Set up a test container with a test database."""
    container = Container()
    container.order_service.override(
        OrderService(
            order_repo=mocked_order_repository,
            client_repo=mocked_client_repository,
            warehouse_repo=mocked_warehouse_repository,
            truck_repo=mocked_truck_repository,
            address_repo=mocked_address_repository,
        )
    )
    return container


@pytest.fixture(scope="module")
def test_client(test_container):
    """Fixture to create a test client with the container injected."""
    app.container = test_container
    return TestClient(app)


@pytest.fixture(scope="module")
def mocked_client_repository():
    """Fixture returning a mocked OrderRepositoryMongo."""
    return AsyncMock(ClientRepositoryMongo)


@pytest.fixture(scope="module")
def mocked_order_repository():
    """Fixture returning a mocked OrderRepositoryMongo."""
    return AsyncMock(OrderRepositoryMongo)


@pytest.fixture(scope="module")
def mocked_warehouse_repository():
    """Fixture returning a mocked WarehouseRepositoryMongo."""
    return AsyncMock(WarehouseRepositoryMongo)


@pytest.fixture(scope="module")
def mocked_truck_repository():
    """Fixture returning a mocked TruckRepositoryMongo."""
    return AsyncMock(TruckRepositoryMongo)


@pytest.fixture(scope="module")
def mocked_address_repository():
    """Fixture returning a mocked AddressRepositoryMongo."""
    return AsyncMock(AddressRepositoryMongo)


@pytest.fixture(scope="module")
def order_data(mocked_address_data):
    """Fixture returning data for a test order."""
    return {
        "delivery_date": "2025-01-07T14:23:45.123000Z",
        "amount": 190,
        "products": [
            {"product_id": "1", "price": 4, "name": "name1", "quantity": 4.0},
            {"product_id": "2", "price": 5, "name": "name2", "quantity": 5.0},
            {"product_id": "3", "price": 6, "name": "name3", "quantity": 6.0},
            {"product_id": "4", "price": 7, "name": "name4", "quantity": 7.0},
            {"product_id": "5", "price": 8, "name": "name5", "quantity": 8.0},
        ],
        "delivery_address": mocked_address_data,
        "order_status": "pending",
        "email": "mocked@mail.com",
        "route_length": 123,
    }


@pytest.fixture(scope="module")
def order_data_high_product_quantity(order_data):
    order_data_copy = copy.deepcopy(order_data)
    order_data_copy["amount"] = 3000
    order_data_copy["products"] = [
        {"product_id": "1", "price": 4, "name": "name1", "quantity": 100.0},
        {"product_id": "2", "price": 5, "name": "name2", "quantity": 100.0},
        {"product_id": "3", "price": 6, "name": "name3", "quantity": 100.0},
        {"product_id": "4", "price": 7, "name": "name4", "quantity": 100.0},
        {"product_id": "5", "price": 8, "name": "name5", "quantity": 100.0},
    ]
    return order_data_copy


@pytest.fixture(scope="module")
def mocked_warehouse_data():
    """Fixture returning a mocked warehouse data."""
    return [
        {
            "id": "1",
            "address": "Warehouse Partial 1",
            "product_quantities": {
                "3": 7.0,
                "5": 9.0,
                "1": 1.5,
                "2": 1.5,
                "4": 1.5,
            },  # 2
            "trucks": ["3"],
        },
        {
            "id": "2",
            "address": "Warehouse Partial 2",
            "product_quantities": {
                "1": 7.0,
                "3": 8.0,
                "4": 9.0,
                "2": 9.0,
                "5": 1.5,
            },  # 4
            "trucks": ["2"],
        },
        {
            "id": "3",
            "address": "Warehouse Partial 3",
            "product_quantities": {
                "3": 7.0,
                "4": 9.0,
                "1": 1.5,
                "2": 1.5,
                "5": 1.5,
            },  # 2
            "trucks": ["4"],
        },
        {
            "id": "4",
            "address": "Warehouse Full",
            "product_quantities": {
                "1": 4.0,
                "2": 5.0,
                "3": 6.0,
                "4": 7.0,
                "5": 8.0,
            },  # 5
            "trucks": ["1"],
        },
    ]


@pytest.fixture(scope="module")
def mocked_warehouse_response(mocked_warehouse_data):
    """Fixture returning a mocked list of warehouse responses."""
    response = []
    for warehouse_items in mocked_warehouse_data:
        response.append(WarehouseResponse(**warehouse_items))
    return response


@pytest.fixture(scope="module")
def mocked_order_response_data():
    """Fixture returning a mocked order response data."""
    return {
        "id": str(ObjectId),
        "delivery_date": "2025-01-07T14:23:45.123000Z",
        "amount": 190,
        "products": [
            {"product_id": "1", "quantity": 4.0},
            {"product_id": "2", "quantity": 5.0},
            {"product_id": "3", "quantity": 6.0},
            {"product_id": "4", "quantity": 7.0},
            {"product_id": "5", "quantity": 8.0},
        ],
        "delivery_address": "1",
        "order_status": "pending",
        "email": "mocked@mail.com",
        "trucks": ["1"],
        "warehouses": ["2", "1"],
        "route_length": 123.0,
    }


@pytest.fixture(scope="module")
def mocked_address_data():
    return {
        "id": "1",
        "street": "mock_street",
        "house_number": "1",
        "postal_code": "12-345",
        "city": "mock_city",
        "voivodeship": "Mock Voivodeship",
    }


@pytest.fixture(scope="module")
def mocked_truck_data():
    return [
        {
            "id": "1",
            "registration_number": "WA8802C",
            "warehouse": "4",
            "lift_capacity": 1500,
            "active_orders": ["677d74d59da405a637925a42"],
        },
        {
            "id": "2",
            "registration_number": "WA8802D",
            "warehouse": "1",
            "lift_capacity": 1500,
            "active_orders": [],
        },
        {
            "id": "3",
            "registration_number": "WA8802E",
            "warehouse": "2",
            "lift_capacity": 1500,
            "active_orders": [],
        },
        {
            "id": "4",
            "registration_number": "WA8802T",
            "warehouse": "3",
            "lift_capacity": 1500,
            "active_orders": [],
        },
    ]


@pytest.fixture(scope="module")
def mocked_summary_response():
    summary_response = [
        {"amount": 30.0, "region": "Mock Voivodeship2", "order_count": 1},
        {"amount": 220.0, "region": "Mock Voivodeship", "order_count": 2},
    ]
    return sorted(summary_response, key=lambda x: json.dumps(x, sort_keys=True))


@pytest.fixture(scope="module")
def mocked_truck_list_response(mocked_truck_data):
    response = []
    for truck in mocked_truck_data:
        response.append([TruckResponse(**truck)])
    return response


@pytest.fixture(scope="module")
def mocked_another_order_response_data(mocked_order_response_data):
    order_response_data_copy = copy.deepcopy(mocked_order_response_data)
    order_response_data_copy["trucks"] = ["2", "3"]
    order_response_data_copy["warehouses"] = ["2", "1"]
    return order_response_data_copy


@pytest.fixture(scope="module")
def mocked_active_orders_for_trucks(mocked_another_order_response_data):
    return OrderResponse(**mocked_another_order_response_data)


@pytest.fixture(scope="module")
def mocked_stripe_session_response():
    load_dotenv(override=False)
    FRONTEND_URL = os.getenv("REACT_APP_URL")
    SUCCESS_URL = f"{FRONTEND_URL}/success"
    mock_checkout_session = MagicMock()
    mock_checkout_session.url = SUCCESS_URL
    return mock_checkout_session


async def assert_order_response(mock_order_data, response_json):
    assert response_json["delivery_date"] == mock_order_data["delivery_date"]
    assert response_json["amount"] == mock_order_data["amount"]
    assert response_json["products"] == mock_order_data["products"]
    assert response_json["delivery_address"] == mock_order_data["delivery_address"]
    assert response_json["order_status"] == mock_order_data["order_status"]
    assert response_json["email"] == mock_order_data["email"]
    assert response_json["trucks"] == mock_order_data["trucks"]
    assert response_json["warehouses"] == mock_order_data["warehouses"]


@pytest.mark.asyncio
async def test_set_order_as_complete(
    test_client,
    test_container,
    order_data,
    mocked_order_response_data,
    mocked_order_repository,
    mocked_truck_repository,
    jwt_token_admin,
):
    """Integration test the of the /purchase endpoint."""
    order_id = mocked_order_response_data
    mocked_order_repository.update_order_status_db.return_value = True
    mocked_order_response_data_copy = copy.deepcopy(mocked_order_response_data)
    mocked_order_response_data_copy["order_status"] = "complete"
    mocked_order_repository.get_order_by_id.return_value = OrderResponse(
        **mocked_order_response_data_copy
    )
    mocked_truck_repository.delete_order_from_truck_db.return_value = 1
    response = test_client.put(
        f"/api/orders/{order_id}/complete",
        headers={"Authorization": f"Bearer {jwt_token_admin}"},
    )

    assert response.status_code == 200
    response_json = response.json()["order"]
    await assert_order_response(mocked_order_response_data_copy, response_json)


@pytest.mark.asyncio
async def test_add_order_success(
    test_client,
    order_data,
    mocked_order_response_data,
    mocked_order_repository,
    mocked_truck_repository,
    mocked_active_orders_for_trucks,
    mocked_truck_list_response,
    mocked_warehouse_response,
    mocked_warehouse_repository,
    mocked_client_repository,
    mocked_address_repository,
    mocked_address_data,
    mocked_another_order_response_data,
    mocked_stripe_session_response,
    jwt_token_client,
):
    """Integration test for making orders."""
    mocked_warehouse_repository.get_warehouses.return_value = mocked_warehouse_response
    # this is used in loop for each warehouse
    mocked_truck_repository.get_trucks_by_warehouse.side_effect = (
        mocked_truck_list_response
    )
    mocked_order_repository.get_order_by_id.return_value = (
        mocked_active_orders_for_trucks
    )
    mocked_order_repository.add_order.return_value = OrderResponse(
        **mocked_order_response_data
    )
    mocked_address_repository.add_address.return_value = AddressResponse(
        **mocked_address_data
    )
    with patch(
        "stripe.checkout.Session.create", return_value=mocked_stripe_session_response
    ):
        response = test_client.post(
            "/api/purchase",
            json=order_data,
            headers={"Authorization": f"Bearer {jwt_token_client}"},
        )

        assert response.status_code == 200
        response_json = response.json()["order"]
        await assert_order_response(mocked_another_order_response_data, response_json)

    mocked_truck_repository.get_trucks_by_warehouse.side_effect = None


@pytest.mark.asyncio
async def test_add_order_not_enough_products_in_warehouse_fail(
    test_client,
    order_data_high_product_quantity,
    mocked_order_response_data,
    mocked_order_repository,
    mocked_truck_repository,
    mocked_active_orders_for_trucks,
    mocked_truck_list_response,
    mocked_warehouse_response,
    mocked_warehouse_repository,
    mocked_client_repository,
    mocked_another_order_response_data,
    mocked_address_data,
    mocked_address_repository,
    jwt_token_client,
    mocked_stripe_session_response,
):
    """Integration test for making orders."""

    mocked_warehouse_repository.get_warehouses.return_value = mocked_warehouse_response
    # this is used in loop for each warehouse
    mocked_truck_repository.get_trucks_by_warehouse.side_effect = (
        mocked_truck_list_response
    )
    mocked_order_repository.get_order_by_id.return_value = (
        mocked_active_orders_for_trucks
    )
    mocked_address_repository.add_address.return_value = AddressResponse(
        **mocked_address_data
    )
    mocked_order_repository.add_order.return_value = OrderResponse(
        **mocked_order_response_data
    )
    with patch(
        "stripe.checkout.Session.create", return_value=mocked_stripe_session_response
    ):
        response = test_client.post(
            "/api/purchase",
            json=order_data_high_product_quantity,
            headers={"Authorization": f"Bearer {jwt_token_client}"},
        )

        assert response.status_code == 409
        assert response.json()["error"] == "Unable to realize order"

    mocked_truck_repository.get_trucks_by_warehouse.side_effect = None


@pytest.mark.asyncio
async def test_update_order_in_client_failed(
    test_client,
    order_data,
    mocked_warehouse_repository,
    mocked_warehouse_response,
    mocked_truck_repository,
    mocked_truck_list_response,
    mocked_order_repository,
    mocked_active_orders_for_trucks,
    mocked_order_response_data,
    mocked_client_repository,
    mocked_address_repository,
    mocked_address_data,
    jwt_token_client,
    mocked_stripe_session_response,
):
    mocked_warehouse_repository.get_warehouses.return_value = mocked_warehouse_response
    # this is used in loop for each warehouse
    mocked_truck_repository.get_trucks_by_warehouse.side_effect = (
        mocked_truck_list_response
    )
    mocked_order_repository.get_order_by_id.return_value = (
        mocked_active_orders_for_trucks
    )
    mocked_address_repository.add_address.return_value = AddressResponse(
        **mocked_address_data
    )
    mocked_order_repository.add_order.return_value = OrderResponse(
        **mocked_order_response_data
    )
    mocked_client_repository.add_order_to_client_db.side_effect = FailedToUpdateError(
        Entity.client.value
    )
    with patch(
        "stripe.checkout.Session.create", return_value=mocked_stripe_session_response
    ):
        response = test_client.post(
            "/api/purchase",
            json=order_data,
            headers={"Authorization": f"Bearer {jwt_token_client}"},
        )

        assert response.status_code == 404
        assert (
            response.json()["error"]
            == f"Failed to update field in {Entity.client.value}"
        )

    mocked_client_repository.add_order_to_client_db.side_effect = None
    mocked_truck_repository.get_trucks_by_warehouse.side_effect = None


@pytest.mark.asyncio
async def test_order_link_to_truck_failed(
    test_client,
    order_data,
    mocked_warehouse_repository,
    mocked_warehouse_response,
    mocked_truck_repository,
    mocked_truck_list_response,
    mocked_order_repository,
    mocked_active_orders_for_trucks,
    mocked_order_response_data,
    mocked_address_repository,
    mocked_address_data,
    jwt_token_client,
    mocked_stripe_session_response,
):
    mocked_warehouse_repository.get_warehouses.return_value = mocked_warehouse_response

    mocked_truck_repository.get_trucks_by_warehouse.side_effect = (
        mocked_truck_list_response
    )
    mocked_order_repository.get_order_by_id.return_value = (
        mocked_active_orders_for_trucks
    )
    mocked_address_repository.add_address.return_value = AddressResponse(
        **mocked_address_data
    )
    mocked_order_repository.add_order.return_value = OrderResponse(
        **mocked_order_response_data
    )
    mocked_truck_repository.add_order_to_trucks_db.side_effect = FailedToUpdateError(
        Entity.truck.value
    )

    with patch(
        "stripe.checkout.Session.create", return_value=mocked_stripe_session_response
    ):
        response = test_client.post(
            "/api/purchase",
            json=order_data,
            headers={"Authorization": f"Bearer {jwt_token_client}"},
        )
        assert response.status_code == 404
        assert (
            response.json()["error"]
            == f"Failed to update field in {Entity.truck.value}"
        )

    mocked_truck_repository.add_order_to_trucks_db.side_effect = None
    mocked_truck_repository.get_trucks_by_warehouse.side_effect = None


@pytest.mark.asyncio
async def test_get_product_invalid_date_type(
    test_client, test_container, mocked_order_repository, jwt_token_admin
):
    """Test retrieving an order with invalid date type."""
    order_id = "677fe80f0a34748487855a54"
    date = "2025-01-07T14:23:45.123Z"
    mocked_order_repository.get_order_by_id.side_effect = InvalidDateType(
        date, Entity.order.value
    )
    response = test_client.get(
        f"/api/orders/{order_id}",
        headers={"Authorization": f"Bearer {jwt_token_admin}"},
    )

    assert response.status_code == 404
    assert (
        response.json()["error"]
        == f"Date: {date} in {Entity.order.value} is in invalid"
        f"type: should be datetime, is {type(date).__name__}"
    )

    mocked_order_repository.get_order_by_id.side_effect = None


@pytest.mark.asyncio
async def test_get_list_of_unavailable_dates(
    test_client,
    test_container,
    mocked_truck_data,
    mocked_truck_repository,
    mocked_order_response_data,
    mocked_order_repository,
    jwt_token_client,
):
    truck_data = copy.deepcopy(mocked_truck_data)
    mocked_truck_list = []
    for truck in truck_data:
        truck["active_orders"] = ["1"]
        mocked_truck_list.append(TruckResponse(**truck))
    mocked_truck_repository.get_trucks.return_value = mocked_truck_list
    mocked_order_repository.get_order_by_id.return_value = OrderResponse(
        **mocked_order_response_data
    )

    response = test_client.get(
        "/api/checkout", headers={"Authorization": f"Bearer {jwt_token_client}"}
    )

    assert response.status_code == 200
    unavailable_dates = response.json()["dates"]
    assert unavailable_dates == ["2025-01-07"]


@pytest.mark.asyncio
async def test_get_orders_success_end_to_end(
    test_client, test_container, order_data, jwt_token_admin
):
    """End-to-end test the of the /orders endpoint."""
    test_container.order_service.override(
        OrderService(
            order_repo=OrderRepositoryMongo(),
            client_repo=ClientRepositoryMongo(),
            warehouse_repo=WarehouseRepositoryMongo(),
            truck_repo=TruckRepositoryMongo(),
            address_repo=AddressRepositoryMongo(),
        )
    )
    order_id = "678309a0490b1b3e797ded8b"

    response = test_client.get(
        "/api/orders", headers={"Authorization": f"Bearer {jwt_token_admin}"}
    )

    assert response.status_code == 200
    response_json = response.json()["orders"]

    response_one_order = test_client.get(
        f"/api/orders/{order_id}",
        headers={"Authorization": f"Bearer {jwt_token_admin}"},
    )
    assert response.status_code == 200
    order = response_one_order.json()["order"]

    assert order in response_json


@pytest.mark.asyncio
async def test_add_order_success_end_to_end(
    test_client,
    order_data,
    test_container,
    jwt_token_admin,
    jwt_token_client,
    mocked_stripe_session_response,
):
    """Integration test for making orders."""
    test_container.order_service.override(
        OrderService(
            order_repo=OrderRepositoryMongo(),
            client_repo=ClientRepositoryMongo(),
            warehouse_repo=WarehouseRepositoryMongo(),
            truck_repo=TruckRepositoryMongo(),
            address_repo=AddressRepositoryMongo(),
        )
    )

    with patch(
        "stripe.checkout.Session.create", return_value=mocked_stripe_session_response
    ):
        response = test_client.post(
            "/api/purchase",
            json=order_data,
            headers={"Authorization": f"Bearer {jwt_token_client}"},
        )

        assert response.status_code == 200
        response_json = response.json()

        assert response_json["url"] == mocked_stripe_session_response.url
        add_order_response = response_json["order"]
        order_id = add_order_response["id"]
        response_get = test_client.get(
            f"/api/orders/{order_id}",
            headers={"Authorization": f"Bearer {jwt_token_admin}"},
        )
        order = response_get.json()["order"]

        await assert_order_response(order, add_order_response)

    test_client.put(
        f"/api/orders/{order_id}/complete",
        headers={"Authorization": f"Bearer {jwt_token_admin}"},
    )


@pytest.mark.asyncio
async def test_get_list_of_unavailable_dates_end_to_end(
    test_client, test_container, jwt_token_client
):
    test_container.order_service.override(
        OrderService(
            order_repo=OrderRepositoryMongo(),
            client_repo=ClientRepositoryMongo(),
            warehouse_repo=WarehouseRepositoryMongo(),
            truck_repo=TruckRepositoryMongo(),
            address_repo=AddressRepositoryMongo(),
        )
    )

    response = test_client.get(
        "/api/checkout", headers={"Authorization": f"Bearer {jwt_token_client}"}
    )

    assert response.status_code == 200
    unavailable_dates = response.json()["dates"]
    assert unavailable_dates == ["2025-01-06", "2025-01-08"]


@pytest.mark.asyncio
async def test_stats_end_to_end(
    test_client, test_container, jwt_token_admin, mocked_summary_response
):
    test_container.order_service.override(
        OrderService(
            order_repo=OrderRepositoryMongo(),
            client_repo=ClientRepositoryMongo(),
            warehouse_repo=WarehouseRepositoryMongo(),
            truck_repo=TruckRepositoryMongo(),
            address_repo=AddressRepositoryMongo(),
        )
    )
    start_date = "2025-01-01T23:00:00.000Z"
    end_date = "2025-01-06T23:00:00.000Z"

    response = test_client.get(
        f"api/orders/stats?start_date={start_date}" f"&end_date={end_date}",
        headers={"Authorization": f"Bearer {jwt_token_admin}"},
    )

    assert response.status_code == 200
    response_json = response.json()
    sorted_response_json = sorted(
        response_json, key=lambda x: json.dumps(x, sort_keys=True)
    )
    assert sorted_response_json == mocked_summary_response

import abc
from typing import List

from application.responses import TruckResponse
from domain.truck import Truck


class AbstractTruckRepository(abc.ABC):

    @abc.abstractmethod
    async def upload_truck_to_db(self, truck: Truck) -> TruckResponse:
        pass

    @abc.abstractmethod
    def get_truck_by_id(self, truck_id: str) -> TruckResponse:
        pass

    @abc.abstractmethod
    def get_trucks_by_warehouse(self, warehouse_id: str) -> List[TruckResponse]:
        pass

    @abc.abstractmethod
    def add_order_to_trucks_db(self, order_id: str, truck_id: List[str]) -> int:
        pass

    @abc.abstractmethod
    def get_trucks(self) -> List[TruckResponse]:
        pass

    @abc.abstractmethod
    def delete_order_from_truck_db(self, truck_id: str, truck_ids: List[str]) -> int:
        pass

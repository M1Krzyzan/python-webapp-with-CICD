import abc
from typing import List, Optional

from application.responses import WarehouseResponse
from domain.truck import Truck


class AbstractWarehouseRepository(abc.ABC):
    @abc.abstractmethod
    def add_warehouse(self, truck: Truck) -> WarehouseResponse:
        pass

    @abc.abstractmethod
    def get_warehouses(self, query: Optional[dict] = None) -> List[WarehouseResponse]:
        pass

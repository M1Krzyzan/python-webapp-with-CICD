from typing import List, Optional

from application.responses import ProductResponse, WarehouseResponse
from application.warehouse.warehouse_repository import AbstractWarehouseRepository
from domain.warehouse import Warehouse
from infrastructure.mongo.mongo_client import MongoDBClient


class WarehouseRepositoryMongo(AbstractWarehouseRepository):
    def __init__(self):
        self.warehouse_collection = MongoDBClient.get_collection("warehouses")

    async def add_warehouse(self, warehouse: Warehouse) -> WarehouseResponse:
        warehouse_data = warehouse.model_dump()
        result = self.warehouse_collection.insert_one(warehouse_data)
        warehouse_data["id"] = str(result.inserted_id)
        return ProductResponse(**warehouse_data)

    def get_warehouses(self, query: Optional[dict] = None) -> List[WarehouseResponse]:
        warehouses = self.warehouse_collection.find(query)
        response_list = []
        for warehouse in warehouses:
            warehouse["id"] = str(warehouse["_id"])
            response_list.append(WarehouseResponse(**warehouse))
        return response_list

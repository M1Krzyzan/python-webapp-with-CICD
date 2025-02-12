from typing import List

from bson import ObjectId

from application.responses import TruckResponse
from application.truck.truck_repository import AbstractTruckRepository
from domain.entities import Entity
from domain.exceptions import InvalidIdError, EntityNotFoundError, FailedToUpdateError
from domain.truck import Truck
from infrastructure.mongo.mongo_client import MongoDBClient


class TruckRepositoryMongo(AbstractTruckRepository):
    def __init__(self):
        self.truck_collection = MongoDBClient.get_collection("trucks")

    async def upload_truck_to_db(self, truck: Truck) -> TruckResponse:
        truck_data = truck.model_dump()
        truck_data["id"] = str(self.truck_collection.insert_one(truck_data).inserted_id)
        return TruckResponse(**truck_data)

    def get_truck_by_id(self, truck_id: str) -> TruckResponse:
        try:
            object_id = ObjectId(truck_id)
        except Exception as err:
            raise InvalidIdError(Entity.truck.value, str(err))
        truck_data = self.truck_collection.find_one({"_id": object_id})

        if not truck_data:
            raise EntityNotFoundError(Entity.truck.value, truck_id)

        truck_data["id"] = str(truck_data["_id"])
        return TruckResponse(**truck_data)

    def get_trucks_by_warehouse(self, warehouse_id: str) -> List[TruckResponse]:
        trucks_data = self.truck_collection.find({"warehouse": warehouse_id})

        response = []
        for truck in trucks_data:
            truck["id"] = str(truck["_id"])
            response.append(TruckResponse(**truck))
        return response

    def add_order_to_trucks_db(self, order_id: str, truck_ids: List[str]) -> int:
        try:
            object_ids = [ObjectId(truck_id) for truck_id in truck_ids]
        except Exception as err:
            raise InvalidIdError(Entity.order.value, str(err))

        result = self.truck_collection.update_many(
            {"_id": {"$in": object_ids}}, {"$addToSet": {"active_orders": order_id}}
        )
        if result.modified_count != len(truck_ids):
            FailedToUpdateError(Entity.truck.value)
        return result.modified_count

    def get_trucks(self) -> List[TruckResponse]:
        trucks_data = self.truck_collection.find()

        response = []
        for truck in trucks_data:
            truck["id"] = str(truck["_id"])
            response.append(TruckResponse(**truck))
        return response

    def delete_order_from_truck_db(self, order_id: str, truck_ids: List[str]) -> int:
        try:
            object_ids = [ObjectId(truck_id) for truck_id in truck_ids]
        except Exception as err:
            raise InvalidIdError(Entity.order.value, str(err))
        result = self.truck_collection.update_many(
            {"_id": {"$in": object_ids}}, {"$pull": {"active_orders": order_id}}
        )
        return result.modified_count

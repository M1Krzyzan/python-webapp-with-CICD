from bson import ObjectId
from pydantic import EmailStr
from pymongo.errors import DuplicateKeyError

from application.client.client_repository import AbstractClientRepository
from application.responses import ClientResponse
from domain.client import Client
from domain.entities import Entity
from domain.exceptions import (
    EntityNotFoundError,
    InvalidIdError,
    EmailNotUniqueError,
    FailedToUpdateError,
)
from infrastructure.mongo.mongo_client import MongoDBClient


class ClientRepositoryMongo(AbstractClientRepository):
    def __init__(self):
        self.client_collection = MongoDBClient.get_collection("clients")

    def register_client_db(self, client: Client) -> ClientResponse:
        client_data = client.model_dump()
        client_data["orders"] = []

        try:
            client_data["id"] = str(
                self.client_collection.insert_one(client_data).inserted_id
            )
        except DuplicateKeyError:
            raise EmailNotUniqueError(client.email)

        return ClientResponse(**client_data)

    def get_client_db(self, client_id: str) -> ClientResponse:
        try:
            object_id = ObjectId(client_id)
        except Exception as err:
            raise InvalidIdError(Entity.client.value, str(err))
        client_data = self.client_collection.find_one({"_id": object_id})

        if not client_data:
            raise EntityNotFoundError(Entity.client.value, client_id)

        client_data["id"] = str(client_data["_id"])
        client_data["delivery_address"] = str(client_data["delivery_address"])
        client_data["payment_address"] = str(client_data["payment_address"])

        if not client_data["orders"]:
            client_data["orders"] = []
        return ClientResponse(**client_data)

    def add_order_to_client_db(self, order_id: str, email: EmailStr) -> bool:
        try:
            object_id = ObjectId(order_id)
        except Exception as err:
            raise InvalidIdError(Entity.order.value, str(err))

        orders = self.client_collection.update_one(
            {"email": email},
            {"$addToSet": {"orders": object_id}},
        )

        if not orders.acknowledged:
            raise FailedToUpdateError(Entity.order.value, Entity.client.value)

        return orders.acknowledged

    def update_addresses(
        self, client_id: str, delivery_address: str, payment_address: str
    ) -> bool:
        try:
            object_id = ObjectId(client_id)
        except Exception as err:
            raise InvalidIdError(Entity.order.value, str(err))

        addresses = self.client_collection.update_one(
            {"_id": object_id},
            {
                "$set": {
                    "delivery_address": delivery_address,
                    "payment_address": payment_address,
                }
            },
        )
        return addresses.acknowledged

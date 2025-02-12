from bson import ObjectId

from application.address.address_repository import AbstractAddressRepository
from application.responses import AddressResponse
from domain.address import Address
from domain.exceptions import InvalidIdError, EntityNotFoundError
from infrastructure.mongo.mongo_client import MongoDBClient
from domain.entities import Entity


class AddressRepositoryMongo(AbstractAddressRepository):
    def __init__(self):
        self.address_collection = MongoDBClient.get_collection("addresses")

    def add_address(self, address: Address) -> AddressResponse:
        address_data = address.model_dump()
        address_from_db = self.address_collection.find_one(address_data)
        if address_from_db:
            address_data["id"] = str(address_from_db["_id"])
        else:
            address_data["id"] = str(
                self.address_collection.insert_one(address_data).inserted_id
            )

        return AddressResponse(**address_data)

    def get_address_db(self, address_id: str) -> AddressResponse:
        try:
            object_id = ObjectId(address_id)
        except Exception as err:
            raise InvalidIdError(Entity.address.value, str(err))
        address_data = self.address_collection.find_one({"_id": object_id})

        if not address_data:
            raise EntityNotFoundError(Entity.address.value, address_id)

        address_data["id"] = str(address_data["_id"])

        return AddressResponse(**address_data)

from application.address.address_repository import AbstractAddressRepository
from application.client.client_repository import AbstractClientRepository
from application.requests import ClientRequest
from application.responses import ClientResponse
from domain.address import Address
from domain.client import Client


class ClientService:
    def __init__(
        self,
        client_repo: AbstractClientRepository,
        address_repo: AbstractAddressRepository,
    ) -> None:
        self._client_repo = client_repo
        self._address_repo = address_repo

    def register_client(self, client_req: ClientRequest) -> ClientResponse:
        client_data = client_req.model_dump()
        payment_address = client_data["payment_address"]
        delivery_address = client_data["delivery_address"]
        client_data["payment_address"] = ""
        client_data["delivery_address"] = ""
        client = Client(**client_data)

        client_data_db = self._client_repo.register_client_db(client).model_dump()

        payment_address = Address(**payment_address)
        client_data_db["payment_address"] = self._address_repo.add_address(
            payment_address
        ).id
        delivery_address = Address(**delivery_address)
        client_data_db["delivery_address"] = self._address_repo.add_address(
            delivery_address
        ).id

        self._client_repo.update_addresses(
            client_data_db["id"],
            client_data_db["delivery_address"],
            client_data_db["payment_address"],
        )

        return ClientResponse(**client_data_db)

    def get_client(self, client_id: str) -> ClientResponse:
        return self._client_repo.get_client_db(client_id)

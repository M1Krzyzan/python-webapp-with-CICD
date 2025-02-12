import abc

from pydantic import EmailStr

from application.responses import ClientResponse
from domain.client import Client


class AbstractClientRepository(abc.ABC):
    @abc.abstractmethod
    def register_client_db(self, client: Client) -> ClientResponse:
        pass

    @abc.abstractmethod
    def get_client_db(self, client_id: str) -> ClientResponse:
        pass

    @abc.abstractmethod
    def add_order_to_client_db(self, order_id: str, email: EmailStr) -> str:
        pass

    def update_addresses(
        self, client_id: str, delivery_address: str, payment_address: str
    ) -> bool:
        pass

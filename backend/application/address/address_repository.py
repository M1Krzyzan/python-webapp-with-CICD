import abc

from application.responses import AddressResponse
from domain.address import Address


class AbstractAddressRepository(abc.ABC):
    @abc.abstractmethod
    def add_address(self, address: Address) -> AddressResponse:
        pass

    @abc.abstractmethod
    def get_address_db(self, address_id: str) -> AddressResponse:
        pass

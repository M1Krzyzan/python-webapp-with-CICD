from dependency_injector import containers, providers

from application.client.client_service import ClientService
from application.order.order_service import OrderService
from application.product.product_service import ProductService
from infrastructure.mongo.address_repository import AddressRepositoryMongo
from infrastructure.mongo.client_repository import ClientRepositoryMongo
from infrastructure.mongo.order_repository import OrderRepositoryMongo
from infrastructure.mongo.product_repository import ProductRepositoryMongo
from infrastructure.mongo.truck_repository import TruckRepositoryMongo
from infrastructure.mongo.warehouse_repository import WarehouseRepositoryMongo


class Container(containers.DeclarativeContainer):
    """Dependency Injection Container."""

    wiring_config = containers.WiringConfiguration(
        modules=[
            "infrastructure.api.endpoints.product_router",
            "infrastructure.api.endpoints.client_router",
            "infrastructure.api.endpoints.order_router",
        ]
    )

    # Repository Provider
    product_repository = providers.Factory(ProductRepositoryMongo)
    client_repository = providers.Factory(ClientRepositoryMongo)
    order_repository = providers.Factory(OrderRepositoryMongo)
    address_repository = providers.Factory(AddressRepositoryMongo)
    warehouse_repository = providers.Factory(WarehouseRepositoryMongo)
    truck_repository = providers.Factory(TruckRepositoryMongo)

    # Service Provider
    product_service = providers.Factory(
        ProductService,
        product_repo=product_repository,
    )

    client_service = providers.Factory(
        ClientService,
        client_repo=client_repository,
        address_repo=address_repository,
    )

    order_service = providers.Factory(
        OrderService,
        order_repo=order_repository,
        client_repo=client_repository,
        warehouse_repo=warehouse_repository,
        truck_repo=truck_repository,
        address_repo=address_repository,
    )

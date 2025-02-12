import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from domain.exceptions import RepositoryError, BusinessLogicError, AuthError
from infrastructure.api.endpoints.auth_router import auth_router
from infrastructure.api.endpoints.client_router import client_router
from infrastructure.api.endpoints.order_router import order_router
from infrastructure.api.endpoints.product_router import product_router
from infrastructure.api.exception_handler import (
    repository_exception_handler,
    business_logic_exception_handler,
    exception_credentials_handler,
)
from infrastructure.containers import Container

app = FastAPI()

container = Container()

app.container = container

# zapobieganie CORS
origins = [
    "*",  # frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows your frontend to make requests
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

app.include_router(product_router, prefix="/api", tags=["products"])
app.include_router(client_router, prefix="/api", tags=["clients"])
app.include_router(order_router, prefix="/api", tags=["orders"])
app.include_router(auth_router, prefix="/auth", tags=["admin"])
app.add_exception_handler(RepositoryError, repository_exception_handler)
app.add_exception_handler(BusinessLogicError, business_logic_exception_handler)
app.add_exception_handler(AuthError, exception_credentials_handler)

if __name__ == "__main__":

    uvicorn.run(app, host="127.0.0.1", port=8002)

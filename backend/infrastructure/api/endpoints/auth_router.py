from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from application.auth.auth_service import AuthService
from domain.exceptions import InvalidCredentialsError
from infrastructure.mongo.mongo_client import MongoDBClient

auth_router = APIRouter()
admin_collection = MongoDBClient.get_collection("admins")
client_collection = MongoDBClient.get_collection("clients")


@auth_router.post("/token")
async def login_for_access_token(email: str, password: str):
    user = AuthService.authenticate_user(
        email, password, client_collection, admin_collection
    )
    if not user:
        raise InvalidCredentialsError()
    # Generate token
    access_token = AuthService.generate_token_for_user(user)
    return {"access_token": access_token, "token_type": "bearer"}


@auth_router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = AuthService.authenticate_user(
        form_data.username, form_data.password, admin_collection, client_collection
    )
    if not user:
        raise InvalidCredentialsError()

    access_token = AuthService.create_access_token(
        data={
            "email": user["email"],
            "role": user.get("role"),
        }
    )
    print(f"Generated access token: {access_token}")

    return {"access_token": access_token, "token_type": "bearer"}

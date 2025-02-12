import os
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict

from fastapi import Security, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from starlette import status

from domain.exceptions import InvalidCredentialsError
from infrastructure.api.exception_handler import exception_credentials_handler


class AuthService:
    secret_key = os.getenv("SECRET_KEY", "default-secret-key-for-tests")
    algorithm = "HS256"
    access_token_expire_minutes = 30
    pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
    security = HTTPBearer()  # HTTP Bearer scheme for token-based authentication

    @staticmethod
    def verify_jwt_token(
        credentials: HTTPAuthorizationCredentials = Security(security),
    ) -> dict:
        try:
            payload = jwt.decode(
                credentials.credentials,
                AuthService.secret_key,
                algorithms=[AuthService.algorithm],
            )
            if payload.get("role") not in {"admin", "client"}:
                raise exception_credentials_handler

            # Expiry validation
            exp = payload.get("exp")
            if not exp or datetime.fromtimestamp(exp, tz=timezone.utc) < datetime.now(
                timezone.utc
            ):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token has expired",
                    headers={"WWW-Authenticate": "Bearer"},
                )

            return payload
        except JWTError:
            raise exception_credentials_handler

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return AuthService.pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def create_access_token(
        data: dict,
        role: Optional[str] = None,
        expires_delta: Optional[timedelta] = None,
    ) -> str:
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + (
            expires_delta or timedelta(minutes=AuthService.access_token_expire_minutes)
        )
        to_encode.update({"exp": expire})
        if role:
            to_encode.update({"role": role})

        return jwt.encode(
            to_encode, AuthService.secret_key, algorithm=AuthService.algorithm
        )

    @staticmethod
    def authenticate_user(
        email: str, password: str, admin_collection, client_collection
    ):
        admin_user = admin_collection.find_one({"email": email})
        if admin_user and AuthService.verify_password(password, admin_user["password"]):
            return {
                "email": admin_user["email"],
                "role": "admin",
            }

        client_user = client_collection.find_one({"email": email})
        if client_user and AuthService.verify_password(
            password, client_user["password"]
        ):
            return {
                "email": client_user["email"],
                "role": "client",
            }

        return None

    @staticmethod
    def generate_token_for_user(user: dict) -> str:
        return AuthService.create_access_token(
            data={"sub": user["email"]},
            role=user.get("role"),
        )

    @staticmethod
    def is_admin(
        credentials: HTTPAuthorizationCredentials = Security(security),
    ) -> Dict:
        """
        Checks if a user is an admin by verifying their JWT token.

        Args:
            token (str): JWT token.

        Returns:
            dict: Decoded payload if the user is an admin.

        Raises:
            HTTPException: If the user is not an admin or the token is invalid.
        """
        payload = AuthService.verify_jwt_token(credentials=credentials)
        if payload.get("role") != "admin":
            raise InvalidCredentialsError()
        return payload

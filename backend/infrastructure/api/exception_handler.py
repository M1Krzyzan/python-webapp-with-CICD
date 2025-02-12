from fastapi import status
from starlette.responses import JSONResponse

from domain.exceptions import RepositoryError, BusinessLogicError, AuthError


async def repository_exception_handler(request, exc: RepositoryError):
    return JSONResponse(
        status_code=404,
        content=exc.to_dict(),
    )


def exception_credentials_handler(request, exc: AuthError):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content=exc.to_dict(),
        headers={"WWW-Authenticate": "Bearer"},
    )


async def business_logic_exception_handler(request, exc: BusinessLogicError):
    return JSONResponse(
        status_code=409,
        content=exc.to_dict(),
    )

from typing import Any

from pydantic import EmailStr


class RepositoryError(Exception):
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message

    def to_dict(self):
        return {"error": self.message}


class EntityNotFoundError(RepositoryError):
    def __init__(self, entity_name: str, entity_id: str):
        super().__init__(f"{entity_name} with ID {entity_id} not found")


class InvalidIdError(RepositoryError):
    def __init__(self, entity_name: str, message: str):
        super().__init__(f"ID of {entity_name} is invalid: {message}")


class InvalidDateType(RepositoryError):
    def __init__(self, date: Any, entity_name: str):
        super().__init__(
            f"Date: {date} in {entity_name} is in invalid"
            f"type: should be datetime, is {type(date).__name__}"
        )


class FailedToUpdateError(RepositoryError):
    def __init__(self, entity: str):
        super().__init__(f"Failed to update field in {entity}")


class EmailNotUniqueError(RepositoryError):
    def __init__(self, email: EmailStr):
        super().__init__(f"E-mail: {email} is already in use")


class PipelineNoResultsError(RepositoryError):
    def __init__(self):
        super().__init__("No results found for pipline")


class BusinessLogicError(Exception):
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message

    def to_dict(self):
        return {"error": self.message}


class UnableToRealizeOrderError(BusinessLogicError):
    def __init__(self):
        super().__init__("Unable to realize order")


class WrongAmountOfMoneyError(BusinessLogicError):
    def __init__(self, amount: float, amount2: float):
        super().__init__(f"Wrong amount of money is {amount} should be {amount2}")


class AuthError(Exception):
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message

    def to_dict(self):
        return {"error": self.message}


class InvalidCredentialsError(AuthError):
    def __init__(self):
        super().__init__("Invalid credentials")

import re

from pydantic import BaseModel, field_validator


class Address(BaseModel):
    voivodeship: str
    city: str
    street: str
    house_number: str
    postal_code: str

    @field_validator("postal_code")
    def validate_postal_code(cls, value):
        pattern = r"^\d{2}-\d{3}$"
        if not re.match(pattern, value):
            raise ValueError("Postal code must follow the format 00-000")
        return value

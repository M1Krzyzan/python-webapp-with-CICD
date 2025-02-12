from datetime import datetime

from pydantic import BaseModel


class Product(BaseModel):
    name: str
    price: float
    country_of_origin: str
    description: str
    is_vegetable: bool
    expiry_date: datetime
    file: bytes

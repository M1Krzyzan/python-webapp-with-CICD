from typing import Optional, List

from pydantic import BaseModel, EmailStr
from pydantic.v1 import Field


class Client(BaseModel):
    email: EmailStr
    payment_address: Optional[str] = ""
    delivery_address: Optional[str] = ""
    nip: str
    orders: Optional[List[str]] = Field(default_factory=list)
    password: str
    company_name: str

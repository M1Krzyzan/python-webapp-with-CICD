from typing import List

from pydantic import BaseModel
from pydantic.v1 import Field


class Warehouse(BaseModel):
    address: str
    product_quantities: dict
    trucks: List[str] = Field(default_factory=list)

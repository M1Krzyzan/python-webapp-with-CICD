from pydantic import BaseModel


class ProductOrder(BaseModel):
    product_id: str
    quantity: float

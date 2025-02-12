from pydantic import BaseModel


class Admin(BaseModel):
    email: str
    income: str
    orders: str
    magazines: str
    trucks: str
    password: str

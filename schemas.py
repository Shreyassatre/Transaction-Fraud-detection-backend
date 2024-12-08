from decimal import Decimal
from pydantic import BaseModel

class CustomerCreate(BaseModel):
    userName: str
    custFullName: str
    custAccNo: str
    CurrentBal: float
    password: str

class CustomerResponse(BaseModel):
    id: int
    userName: str
    custFullName: str
    custAccNo: str
    CurrentBal: float
    OldBalance: float

    class Config:
        orm_mode = True

class Transaction(BaseModel):
    id: int
    nameOrig: str
    oldbalanceOrg: Decimal
    newbalanceOrig: Decimal
    nameDest: str
    oldbalanceDest: Decimal
    newbalanceDest: Decimal
    amount: Decimal
    type: str
    step: int
    isFraud: int
    riskScore: Decimal

    class Config:
        orm_mode = True
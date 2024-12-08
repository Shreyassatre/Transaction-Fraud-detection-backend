from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from models import Customer
import models
from schemas import CustomerCreate, CustomerResponse
from database import get_db
from crud import add_transaction, create_customer, get_current_balance, get_customer_by_username, process_transaction
import schemas

router = APIRouter()

@router.post("/customers/", response_model=CustomerResponse)
async def create_customer_route(customer: CustomerCreate, db: AsyncSession = Depends(get_db)):
    try:
        new_customer = create_customer(db, customer)
        return new_customer
    except Exception:
        raise HTTPException(status_code=400, detail="Username or account number already exists.")

@router.get("/customers/{userName}", response_model=CustomerResponse)
async def get_customer(userName: str, db: AsyncSession = Depends(get_db)):
    customer = get_customer_by_username(db, userName)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@router.get("/customers/")
async def get_all_customers(db: AsyncSession = Depends(get_db)):
    customers = db.query(Customer).all()
    
    customers_list = [{
        "userName": customer.userName,
        "custAccNo": customer.custAccNo,
        "CurrentBal": customer.CurrentBal
    } for customer in customers]
    
    return customers_list

@router.get("/get_current_balance/{account_no}")
async def get_balance(account_no: str, db: AsyncSession = Depends(get_db)):
    current_balance = get_current_balance(db, account_no)
    
    if current_balance is None:
        raise HTTPException(status_code=404, detail="Account not found")
    
    return {"accountNo": account_no, "currentBalance": current_balance}

@router.post("/transaction/")
async def handle_transaction(transaction_data: dict, db: AsyncSession = Depends(get_db)):
    sender_account = transaction_data['nameOrig']
    receiver_account = transaction_data['nameDest']
    amount = transaction_data['amount']
    type = transaction_data['type']
    step = transaction_data['step']
    riskScore = transaction_data['riskScore']
    isFraud = transaction_data['isFraud']
    
    result = process_transaction(db, sender_account, receiver_account, amount)
    if 'error' in result:
        raise HTTPException(status_code=400, detail=result['error'])

    add_transaction(
        db=db,
        nameOrig=sender_account,
        oldbalanceOrg=transaction_data['oldbalanceOrg'],
        newbalanceOrig=transaction_data['newbalanceOrig'],
        nameDest=receiver_account,
        oldbalanceDest=transaction_data['oldbalanceDest'],
        newbalanceDest=transaction_data['newbalanceDest'],
        amount=amount,
        type=type,
        step=step,
        isFraud=isFraud,
        riskScore=riskScore
    )

    return {"message": "Transaction processed and recorded successfully"}


@router.get("/getAllTransactions/", response_model=List[schemas.Transaction])
def get_transactions(db: AsyncSession = Depends(get_db)):
    transactions = db.query(models.Transaction).all()
    return transactions
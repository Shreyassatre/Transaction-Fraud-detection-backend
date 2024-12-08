from sqlalchemy.orm import Session
from models import Customer, Transaction
from utils import get_password_hash

def create_customer(db: Session, customer_data):
    hashed_password = get_password_hash(customer_data.password)
    new_customer = Customer(
        userName=customer_data.userName,
        custFullName=customer_data.custFullName,
        custAccNo=customer_data.custAccNo,
        CurrentBal=customer_data.CurrentBal,
        OldBalance=0.0,
        hashed_password=hashed_password
    )
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return new_customer

def get_customer_by_username(db: Session, user_name: str):
    return db.query(Customer).filter(Customer.userName == user_name).first()

def get_current_balance(db: Session, account_no: str):
    customer = db.query(Customer).filter(Customer.custAccNo == account_no).first()
    
    if customer:
        return customer.CurrentBal
    else:
        return None
    
def process_transaction(db: Session, sender_account: str, receiver_account: str, amount: float):
    sender = db.query(Customer).filter(Customer.custAccNo == sender_account).first()
    receiver = db.query(Customer).filter(Customer.custAccNo == receiver_account).first()

    if not sender or not receiver:
        return {"error": "Sender or Receiver not found"}

    if sender.CurrentBal < amount:
        return {"error": "Insufficient balance"}

    sender.oldBalance = sender.CurrentBal
    sender.CurrentBal -= amount

    receiver.oldBalance = receiver.CurrentBal
    receiver.CurrentBal += amount 

    db.commit()  

    return {"message": "Transaction processed successfully"}

def add_transaction(
    db: Session,
    nameOrig: str,
    oldbalanceOrg: float,
    newbalanceOrig: float,
    nameDest: str,
    oldbalanceDest: float,
    newbalanceDest: float,
    amount: float,
    type: str,
    step: int,
    isFraud: int,
    riskScore: float
):
    transaction = Transaction(
        nameOrig=nameOrig,
        oldbalanceOrg=oldbalanceOrg,
        newbalanceOrig=newbalanceOrig,
        nameDest=nameDest,
        oldbalanceDest=oldbalanceDest,
        newbalanceDest=newbalanceDest,
        amount=amount,
        type=type,
        step=step,
        isFraud=isFraud,
        riskScore=riskScore
    )

    db.add(transaction) 
    db.commit()
    db.refresh(transaction)

    return transaction
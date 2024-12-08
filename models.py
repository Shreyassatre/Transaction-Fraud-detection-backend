from sqlalchemy import Column, Integer, String, Numeric
from database import Base

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    userName = Column(String, unique=True, index=True, nullable=False)
    custFullName = Column(String, nullable=False)
    custAccNo = Column(String, unique=True, nullable=False)
    CurrentBal = Column(Numeric, nullable=False)
    OldBalance = Column(Numeric, nullable=True)
    hashed_password = Column(String, nullable=False)

class Transaction(Base):
    __tablename__ = 'transactions'

    id = Column(Integer, primary_key=True, index=True)
    nameOrig = Column(String, index=True)
    oldbalanceOrg = Column(Numeric)
    newbalanceOrig = Column(Numeric)
    nameDest = Column(String, index=True)
    oldbalanceDest = Column(Numeric)
    newbalanceDest = Column(Numeric)
    amount = Column(Numeric) 
    type = Column(String)  
    step = Column(Integer) 
    isFraud = Column(Integer)  
    riskScore = Column(Numeric)

    def __repr__(self):
        return f"<Transaction(nameOrig={self.nameOrig}, amount={self.amount}, isFraud={self.isFraud})>"
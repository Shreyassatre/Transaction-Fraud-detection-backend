import pandas as pd
import joblib
from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, f1_score

app = FastAPI()

app = APIRouter()

xgb_model = joblib.load('xgboost_fraud_model.pkl')

class Transaction(BaseModel):
    step: int
    amount: float
    type: str
    nameOrig: str
    oldbalanceOrg: float
    newbalanceOrig: float
    nameDest: str
    oldbalanceDest: float
    newbalanceDest: float

def get_amount_category(amount):
    bins = [0, 1000, 5000, 10000, 20000, 50000, 100000, 200000, float('inf')]
    labels = ['low', 'medium', 'medium_high', 'high', 'very_high', 'extremely_high', 'super_high', 'mega_high']
    return pd.cut([amount], bins=bins, labels=labels)[0]

def preprocess_transaction(transaction):
    transaction['amountCategory'] = get_amount_category(transaction['amount'])

    transaction_type = pd.get_dummies([transaction['type']], prefix='type')
    amount_category = pd.get_dummies([transaction['amountCategory']], prefix='amountCategory')

    columns = ['step', 'amount', 'type_CASH_OUT', 'type_DEBIT', 'type_PAYMENT', 'type_TRANSFER', 
               'amountCategory_high', 'amountCategory_low', 'amountCategory_medium', 
               'amountCategory_medium_high', 'amountCategory_mega_high', 'amountCategory_super_high', 
               'amountCategory_very_high', 'amountCategory_nan']

    transaction_row = pd.DataFrame([{key: transaction[key] if key in transaction else 0 for key in ['step', 'amount']}])

    for col in columns:
        if col.startswith('type_') and col not in transaction_type.columns:
            transaction_type[col] = 0
        if col.startswith('amountCategory_') and col not in amount_category.columns:
            amount_category[col] = 0

    transaction_row = pd.concat([transaction_row, transaction_type, amount_category], axis=1)

    for col in columns:
        if col not in transaction_row.columns:
            transaction_row[col] = 0

    return transaction_row[columns]

@app.post("/predict/")
def predict_fraud(transaction: Transaction):
    try:
        transaction_dict = transaction.dict()
        preprocessed_transaction = preprocess_transaction(transaction_dict)

        risk_score = xgb_model.predict_proba(preprocessed_transaction)[:, 1]

        fraud_prediction = (risk_score > 0.5).astype(int)

        return {
            "risk_score": float(risk_score[0]),
            "risk_score_percentage": f"{risk_score[0] * 100:.2f}%",
            "fraud_prediction": int(fraud_prediction[0])
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

def train_model():
    df = pd.read_csv('transactions.csv')

    df['amountCategory'] = df['amount'].apply(get_amount_category)
    df = pd.get_dummies(df, columns=['type', 'amountCategory'], drop_first=True)

    X = df.drop(columns=['Unnamed: 0', 'isFraud'])
    y = df['isFraud']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

    model = xgb.XGBClassifier(eval_metric='logloss')
    model.fit(X_train, y_train)

    joblib.dump(model, 'xgboost_fraud_model.pkl')

    y_pred_prob = model.predict_proba(X_test)[:, 1]
    auc_score = roc_auc_score(y_test, y_pred_prob)
    f1 = f1_score(y_test, model.predict(X_test))

    print(f"AUC-ROC: {auc_score}")
    print(f"F1-Score: {f1}")


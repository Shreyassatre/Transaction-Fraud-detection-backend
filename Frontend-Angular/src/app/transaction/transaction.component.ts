import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';  // Import SweetAlert2

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent {
  transactionData = {
    step: 1,
    amount: 8000,
    type: 'CASH_OUT',
    nameOrig: 'C0002343',  // Sender's account number
    oldbalanceOrg: 0,       // Sender's old balance (to be fetched)
    newbalanceOrig: 0,      // Sender's new balance (to be calculated)
    nameDest: 'C0002341',  // Receiver's account number
    oldbalanceDest: 0,      // Receiver's old balance (to be fetched)
    newbalanceDest: 0,       // Receiver's new balance (to be calculated)
    riskScore: 0,           // Added to store the risk score
    isFraud: 0              // Added to store the fraud prediction
  };

  types = ['CASH_IN', 'CASH_OUT', 'DEBIT', 'PAYMENT', 'TRANSFER'];

  constructor(private http: HttpClient) {}

  // Fetch current balance for sender and receiver and then submit transaction
  onSubmit() {
    // Step 1: Fetch current balance for the sender and receiver
    this.getCurrentBalance(this.transactionData.nameOrig).subscribe(senderBalance => {
      if(senderBalance.currentBalance < this.transactionData.amount){
        // SweetAlert for insufficient balance
        Swal.fire({
          title: 'Insufficient Balance!',
          text: 'Your current balance is not sufficient for this transaction.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } else {
        this.transactionData.oldbalanceOrg = senderBalance.currentBalance;
        this.transactionData.newbalanceOrig = Math.max(0, this.transactionData.oldbalanceOrg - this.transactionData.amount);  // Calculate new balance for sender

        this.getCurrentBalance(this.transactionData.nameDest).subscribe(receiverBalance => {
          this.transactionData.oldbalanceDest = receiverBalance.currentBalance;
          this.transactionData.newbalanceDest = this.transactionData.oldbalanceDest + this.transactionData.amount;  // Calculate new balance for receiver

          // Step 2: Make the POST request to the fraud detection API
          this.detectFraud().subscribe(fraudResponse => {
            if(fraudResponse.fraud_prediction == 1){
              // SweetAlert for fraud detection
              Swal.fire({
                title: 'Fraud Detected!',
                text: `This Transaction has been detected as fraud with a risk score of ${fraudResponse.risk_score * 100}%`,
                icon: 'warning',
                confirmButtonText: 'OK'
              });
              // Step 3: Update transactionData with fraud details
              this.transactionData.riskScore = fraudResponse.risk_score;
              this.transactionData.isFraud = fraudResponse.fraud_prediction;

              setTimeout(() => {
                this.processTransaction();
              }, 5000);
              
            } else {
              // Step 3: Update transactionData with fraud details
              this.transactionData.riskScore = fraudResponse.risk_score;
              this.transactionData.isFraud = fraudResponse.fraud_prediction;

              // Step 4: Process the transaction after fraud detection
              this.processTransaction();
            }
          }, error => {
            console.error('Fraud Detection Error:', error);
            // Handle fraud detection error (e.g., notify the user, retry, etc.)
            Swal.fire({
              title: 'Error!',
              text: 'There was an error in fraud detection. Please try again later.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          });
        });
      }
    });
  }

  // Function to get current balance for a given account number
  getCurrentBalance(accountNo: string): Observable<any> {
    const url = `https://transaction-fraud-detection-backend.onrender.com/get_current_balance/${accountNo}`;
    return this.http.get<any>(url);
  }

  // Function to call the fraud detection API
  detectFraud(): Observable<any> {
    const fraudUrl = 'https://transaction-fraud-detection-backend.onrender.com/ml/predict/';

    // Prepare the fraud detection request payload
    const fraudPayload = {
      step: this.transactionData.step,
      amount: this.transactionData.amount,
      type: this.transactionData.type,
      nameOrig: this.transactionData.nameOrig,
      oldbalanceOrg: this.transactionData.oldbalanceOrg,
      newbalanceOrig: this.transactionData.newbalanceOrig,
      nameDest: this.transactionData.nameDest,
      oldbalanceDest: this.transactionData.oldbalanceDest,
      newbalanceDest: this.transactionData.newbalanceDest
    };

    // Make POST request to the fraud detection API
    return this.http.post<any>(fraudUrl, fraudPayload, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(
      catchError(error => {
        console.error('Fraud detection request failed:', error);
        throw error;  // Re-throw the error to be handled by the caller
      })
    );
  }

  // Function to process the transaction after fraud detection
  processTransaction() {
    const transactionUrl = 'https://transaction-fraud-detection-backend.onrender.com/transaction/';  // API endpoint to process transaction

    // Send the POST request to the backend API
    this.http.post(transactionUrl, this.transactionData, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).subscribe(
      (response) => {
        console.log('Transaction Response:', response);
        // SweetAlert for successful transaction
        Swal.fire({
          title: 'Transaction Successful!',
          text: 'Your transaction has been successfully processed.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      },
      (error) => {
        console.error('Transaction Error:', error);
        // SweetAlert for transaction error
        Swal.fire({
          title: 'Error!',
          text: 'There was an error processing your transaction. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  }
}

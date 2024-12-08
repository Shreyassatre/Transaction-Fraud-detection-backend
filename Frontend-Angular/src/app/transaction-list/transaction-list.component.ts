import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';  // <-- Import DecimalPipe

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
  providers: [DecimalPipe]  // <-- Add DecimalPipe as a provider
})
export class TransactionListComponent implements OnInit {
  transactions: any[] = [];
  loading: boolean = true;

  constructor(private http: HttpClient, private decimalPipe: DecimalPipe) {}  // <-- Inject DecimalPipe

  ngOnInit() {
    this.getAllTransactions();
  }

  getAllTransactions() {
    this.http.get<any[]>('https://transaction-fraud-detection-backend.onrender.com/getAllTransactions/')
      .subscribe(
        (data) => {
          this.transactions = data;
          this.loading = false;
        },
        (error) => {
          console.error('Error fetching transactions:', error);
          this.loading = false;
        }
      );
  }

  // Function to format numbers (strip trailing zeros)
  formatNumber(value: string | number): string {
    return this.decimalPipe.transform(value, '1.0-0') ?? '';  // '1.0-0' removes decimals if they are all zeros
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  customers: any[] = [];
  displayedColumns: string[] = ['userName', 'custAccNo', 'CurrentBal'];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getCustomers();
  }

  // Fetch the customer list from the backend
  getCustomers() {
    const url = 'https://transaction-fraud-detection-backend.onrender.com/customers/';
    
    this.http.get<any[]>(url).subscribe(
      (response) => {
        this.customers = response;
      },
      (error) => {
        console.error('Error fetching customer list:', error);
      }
    );
  }
}

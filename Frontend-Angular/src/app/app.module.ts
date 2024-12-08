import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule
import { MatTableModule } from '@angular/material/table'; // Import MatTableModule
import { NgChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TransactionComponent } from './transaction/transaction.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { VisualDashboardComponent } from './visual-dashboard/visual-dashboard.component';
import { PiechartComponent } from './piechart/piechart.component';
import { BarchartComponent } from './barchart/barchart.component';
import { AmountBarchartComponent } from './amount-barchart/amount-barchart.component';

@NgModule({
  declarations: [
    AppComponent,
    TransactionComponent,
    LoginComponent,
    NavbarComponent,
    CustomerListComponent,
    TransactionListComponent,
    VisualDashboardComponent,
    PiechartComponent,
    BarchartComponent,
    AmountBarchartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatTableModule,
    BrowserAnimationsModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionComponent } from './transaction/transaction.component';
import { LoginComponent } from './login/login.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { VisualDashboardComponent } from './visual-dashboard/visual-dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/transaction', pathMatch: 'full' }, // Default route
  { path: 'transaction', component: TransactionComponent },
  { path: 'transaction-report', component: TransactionListComponent },
  { path: 'show-uesrs', component: CustomerListComponent },
  { path: 'visual-analysis', component: VisualDashboardComponent },
    // Route for fraud detection
  // You can add more routes as your app grows
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

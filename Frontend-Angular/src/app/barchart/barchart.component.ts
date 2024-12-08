import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import transactionData from '../assets/insights/transaction_types.json';

interface TransactionType {
  total_transactions: number;
  fraud_transactions: number;
  fraud_percentage: number;
}

interface TransactionTypes {
  [key: string]: TransactionType;
}

@Component({
  selector: 'app-barchart',
  template: `
    <div class="chart-container">
      <canvas baseChart
        [data]="chartData"
        [options]="chartOptions"
        [type]="'bar'">
      </canvas>
    </div>
  `,
  styles: [
    ``
  ]
})
export class BarchartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public chartData: ChartData<'bar'> = {
    labels: Object.keys(transactionData),
    datasets: [
      {
        label: 'Total Transactions',
        data: Object.values(transactionData).map(type => type.total_transactions),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        hidden: true
      },
      {
        label: 'Fraudulent Transactions',
        data: Object.values(transactionData).map(type => type.fraud_transactions),
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
      }
    ]
  };

  public chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Transaction Types Analysis'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw as number;
            return `${context.dataset.label}: ${value.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Transaction Types'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Transactions'
        },
        ticks: {
          callback: function(value) {
            return (value as number).toLocaleString();
          }
        }
      }
    }
  };

  constructor() {}

  ngOnInit(): void {
    console.log('Transaction Data:', transactionData);
  }
}
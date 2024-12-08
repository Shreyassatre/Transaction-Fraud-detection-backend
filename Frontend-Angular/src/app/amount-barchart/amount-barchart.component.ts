import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import fraudData from '../assets/insights/fraud_by_amount_category.json';

interface FraudCategory {
  range: string;
  fraud_transactions: number;
}

interface FraudCategories {
  [key: string]: FraudCategory;
}

@Component({
  selector: 'app-amount-barchart',
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
export class AmountBarchartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  // Initialize chart data
  public chartData: ChartData<'bar'> = {
    labels: Object.values(fraudData.categories).map(category => category.range),
    datasets: [
      {
        label: 'Fraudulent Transactions',
        data: Object.values(fraudData.categories).map(category => category.fraud_transactions),
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
        text: 'Fraudulent Transactions by Amount Category'
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
          text: 'Transaction Amount Ranges'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Fraudulent Transactions'
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
    console.log('Fraud Data:', fraudData);
  }
}

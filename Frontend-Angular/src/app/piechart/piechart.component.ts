import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import fraudData from '../assets/insights/fraudVSnon-fraud.json';

// // Add this to avoid TypeScript errors for JSON imports
// declare module "*.json" {
//     const value: any;
//     export default value;
// }

interface FraudData {
  'fraud-transactions': number;
  'non-fraud-transactions': number;
}

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.scss']
})
export class PiechartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public chartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Fraud Transactions', 'Non-Fraud Transactions'],
    datasets: [
      {
        data: [
          fraudData['fraud-transactions'],
          fraudData['non-fraud-transactions']
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',  // Fraud color
          'rgba(54, 162, 235, 0.7)',  // Non-fraud color
        ],
      }
    ]
  };

  public chartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Fraud vs Non-Fraud Transactions'
      }
    }
  };

  constructor() {}

  ngOnInit(): void {
  }

  private updateChart(): void {
    if (this.chart) {
      this.chart.chart?.update();
    }
  }
}
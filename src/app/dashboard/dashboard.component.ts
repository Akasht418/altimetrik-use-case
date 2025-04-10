import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ChartConfiguration } from 'chart.js';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgChartsModule } from 'ng2-charts';
import { InvestmentsFormComponent } from '../investments-form/investments-form.component';
import { ConfirmationComponent } from '../confirmation-form/confirmation.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  AddInvestment,
  DashboardState,
  LoadDashboardData,
} from '../state/portfolio.state';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    NgChartsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  dashBoardData$!: Observable<any>;
  dashBoardData: any;
  pieChartData!: ChartConfiguration<'pie'>['data'];
  marketTrendData!: ChartConfiguration<'line'>['data'];
  perfLineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [12, 19, 3, 5, 2, 3],
        label: 'NASDAQ',
        borderColor: '#3f51b5',
        backgroundColor: 'rgba(63,81,181,0.3)',
        fill: true,
      },
      {
        data: [10, 16, 4, 2, 7, 8],
        label: 'Your Portfolio',
        borderColor: '#3f51b5',
        backgroundColor: 'rgba(198, 101, 10, 0.3)',
        fill: true,
      },
    ],
  };
  pieChartType: any = 'pie';
  lineChartType: any = 'line';

  constructor(
    private dialog: MatDialog,
    private store: Store,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadDashboardData());
    this.dashBoardData$ = this.store.select(DashboardState.getDashboardData);

    this.dashBoardData$.subscribe({
      next: (data) => {
        if (data) {
          this.dashBoardData = data;
          this.prepareCharts();
          this.cd.markForCheck();
        }
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
      },
    });
  }

  prepareCharts() {
    this.pieChartData = this.preparePieChartData();
    this.marketTrendData = this.prepareMarketTrendData();
  }

  getOverallReturn(): string {
    if (!this.dashBoardData) return '';
    return `${this.dashBoardData['overallReturn']}`;
  }

  preparePieChartData(): ChartConfiguration<'pie'>['data'] {
    return {
      labels: ['Stocks', 'Bonds', 'Real Estate', 'Cash'],
      datasets: [
        {
          data: this.formPieChartDataArray(
            this.dashBoardData['assetAllocation']
          ),
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF7043'],
        },
      ],
    };
  }

  formPieChartDataArray(data: any): number[] {
    const labels = ['Stocks', 'Bonds', 'Real Estate', 'Cash'];
    const map = new Map<string, number>();

    data.forEach((element: any) => {
      const current = map.get(element.assetType) || 0;
      map.set(element.assetType, current + element.purchasePrice);
    });

    const assetValues = labels.map((label) => map.get(label) || 0);

    this.dashBoardData.totalPortfolioValue = assetValues.reduce(
      (acc, value) => acc + value,
      0
    );

    return assetValues.map(
      (value) => (value / this.dashBoardData.totalPortfolioValue) * 100
    );
  }

  prepareMarketTrendData(): ChartConfiguration<'line'>['data'] {
    if (!this.dashBoardData) return { labels: [], datasets: [] };
    return {
      labels: this.dashBoardData.marketTrends.map((trend: any) => trend.month),
      datasets: [
        {
          data: this.dashBoardData.marketTrends.map(
            (trend: any) => trend.value
          ),
          label: 'NASDAQ',
          borderColor: '#FF9800',
          backgroundColor: 'rgba(255,152,0,0.3)',
          fill: true,
        },
      ],
    };
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(InvestmentsFormComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const confirmRef = this.dialog.open(ConfirmationComponent, {
          width: '300px',
          data: result,
        });

        confirmRef.afterClosed().subscribe((confirmedResult) => {
          this.store.dispatch(new AddInvestment(confirmedResult));
        });
      }
    });
  }

  get greeting(): string {
    const hour = new Date().getHours();

    if (hour < 12) {
      return 'Good Morning';
    } else if (hour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  }
}

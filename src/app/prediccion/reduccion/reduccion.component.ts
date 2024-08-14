import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {Chart, registerables} from 'chart.js'; // Import registerables
import {HttpClient} from '@angular/common/http';
import {Global} from 'app/global';

@Component({
  selector: 'app-reduccion',
  templateUrl: './reduccion.component.html',
  styleUrls: ['./reduccion.component.css'],
})
export class ReduccionComponent implements OnInit {
  @ViewChild('chartCanvas', {static: true}) chartRef: ElementRef;
  data: any[] = [];
  chartRendered: boolean = false;
  chartType: string = 'percentage';
  chart: any;

  constructor(private http: HttpClient) {
    // Register all components with Chart.js
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.fetchData();
  }

  GetPercentageDifference(currentValue, previousValue) {
    const diff = (currentValue - previousValue) / previousValue;
    return diff * 100;
  }

  fetchData() {
    this.http.get(`${Global.BASE_API_URL}/data.php/merma`).subscribe(
      (res: any) => {
        this.data = res.waste.reverse(); // Reverse the order of the data
        this.renderChart();
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  onChartTypeChange(event: any) {
    this.chartType = event.target.value;
    this.renderChart();
  }

  renderChart() {
    if (this.chart) {
      this.chart.destroy(); // Destroy the previous chart before creating a new one
    }

    const ctx = this.chartRef.nativeElement.getContext('2d');

    if (this.chartType === 'percentage') {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.data.map((item) => item.mes),
          datasets: [
            {
              label: 'Percentage difference from previous month',
              data: this.data.map((item, index, array) => {
                if (index === 0) {
                  return 0;
                } else {
                  const currentMonthValue = item.monto;
                  const previousMonthValue = array[index - 1].monto;
                  return this.GetPercentageDifference(
                    currentMonthValue,
                    previousMonthValue
                  );
                }
              }),
              backgroundColor: this.data.map((item, index, array) => {
                if (index === 0) return 'gray';
                return array[index].monto > array[index - 1].monto
                  ? 'red'
                  : 'green';
              }),
              borderColor: 'black',
              borderWidth: 1,
              barThickness: 40,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'category',
              title: {
                display: true,
                text: 'Month',
              },
              grid: {
                display: false,
              },
            },
            y: {
              title: {
                display: true,
                text: 'Percentage Difference',
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              labels: {
                boxWidth: 20,
              },
              position: 'top',
            },
          },
        },
      });
    } else if (this.chartType === 'waste') {
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.data.map((item) => item.mes),
          datasets: [
            {
              label: 'Wastes',
              data: this.data.map((item) => item.monto),
              borderColor: 'blue',
              borderWidth: 2,
              fill: false,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'category',
              title: {
                display: true,
                text: 'Month',
              },
              grid: {
                display: false,
              },
            },
            y: {
              title: {
                display: true,
                text: 'Wastes',
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              labels: {
                boxWidth: 20,
              },
              position: 'top',
            },
          },
        },
      });
    }

    this.chartRendered = true;
  }
}

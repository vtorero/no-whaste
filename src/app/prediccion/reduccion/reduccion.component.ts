import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {Chart, registerables} from 'chart.js';
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
  chart: any;

  constructor(private http: HttpClient) {
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
    this.http.get(Global.BASE_API_URL + 'data.php/merma').subscribe(
      (res: any) => {
        this.data = res.waste.reverse();
        this.renderChart();
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  renderChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.chartRef.nativeElement.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.data.map((item) => item.mes),
        datasets: [
          {
            label: 'Diferencia porcentual con el mes anterior',
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
              text: 'Mes',
            },
            grid: {
              display: false,
            },
          },
          y: {
            title: {
              display: true,
              text: 'Diferencia Porcentual',
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
}

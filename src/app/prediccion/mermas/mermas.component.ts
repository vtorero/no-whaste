import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {Chart, registerables} from 'chart.js';
import {HttpClient} from '@angular/common/http';
import {Global} from 'app/global';

@Component({
  selector: 'app-mermas',
  templateUrl: './mermas.component.html',
  styleUrls: ['./mermas.component.css'],
})
export class MermasComponent implements OnInit {
  @ViewChild('chartCanvas', {static: true}) chartRef: ElementRef;
  data: any[] = [];
  chart: any;

  constructor(private http: HttpClient) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.fetchData();
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
}

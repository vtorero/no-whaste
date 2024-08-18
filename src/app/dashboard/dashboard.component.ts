import {Component, OnInit} from '@angular/core';
import {VentasService} from './services/ventas.service';
import {InventarioService} from './services/inventario.service';
import {ComprasService} from './services/compras.service';
import Chartist from 'chartist';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  totalVentas: string;
  totalOfertas: string;
  totalVentasSemana: string;
  totalMermas: string;
  totalMermasSemana: string;
  totalDemanda: string;

  constructor(
    private ventasService: VentasService,
    private comprasService: ComprasService,
    private inventarioService: InventarioService
  ) {}

  ngOnInit() {
    this.ventasService.getTotalVentas().subscribe((data) => {
      this.totalVentas = data[0]?.total_ventas_mes;
    });
    this.ventasService.getTotalOferta().subscribe((data) => {
      this.totalOfertas = data[0]?.total_oferta_mes;
    });
    this.ventasService.getVentasSemana().subscribe((data) => {
      this.totalVentasSemana = data[0]?.total_ventas_semana;
    });
    this.inventarioService.getTotalMermas().subscribe((data) => {
      this.totalMermas = data[0]?.total_mermas;
    });
    this.inventarioService.getTotalMermasSemana().subscribe((data) => {
      this.totalMermasSemana = data[0]?.total_kilos_merma_semana;
    });
    this.comprasService.getTotalDemanda().subscribe((data) => {
      this.totalDemanda = data[0]?.total_demanda_mes;
    });
    this.initializeCharts();
  }

  initializeCharts() {
    this.initDailyPurchasesChart();
    this.initHourlyPurchasesChart();
    this.initYearlySalesChart();
  }

  initDailyPurchasesChart() {
    this.comprasService.getComprasPorDia().subscribe((data) => {
      console.log(data); // Log the data to check if it's correct
      const labels = data.map((item) => item.dia_semana); // Assuming 'L', 'M', etc.
      const series = data.map((item) => item.total_compras);

      const dataDailyPurchasesChart: any = {
        labels: labels,
        series: [series],
      };

      const optionsDailyPurchasesChart: any = {
        lineSmooth: Chartist.Interpolation.cardinal({
          tension: 0,
        }),
        low: 0,
        high: Math.max(...series) + 10, // Adjust the high value based on your data
        chartPadding: {top: 0, right: 0, bottom: 0, left: 0},
      };

      const dailyPurchasesChart = new Chartist.Line(
        '#dailyPurchasesChart',
        dataDailyPurchasesChart,
        optionsDailyPurchasesChart
      );

      this.startAnimationForLineChart(dailyPurchasesChart);
    });
  }

  initHourlyPurchasesChart() {
    this.comprasService.getComprasPorHora().subscribe((data) => {
      console.log('Hourly Purchases Data:', data); // Log the data received from the API
      if (!data || !data.labels || !data.series || !data.series[0]) {
        console.error('Data is missing or incomplete', data);
        return; // Exit early if data is not as expected
      }

      const labels = data.labels;
      const series = data.series[0];

      const dataHourlyPurchasesChart: any = {
        labels: labels,
        series: [series],
      };

      const optionsHourlyPurchasesChart: any = {
        lineSmooth: Chartist.Interpolation.cardinal({
          tension: 0,
        }),
        low: 0,
        high: Math.max(...series) + 10,
        chartPadding: {top: 0, right: 0, bottom: 0, left: 0},
      };

      const hourlyPurchasesChart = new Chartist.Line(
        '#hourlyPurchasesChart',
        dataHourlyPurchasesChart,
        optionsHourlyPurchasesChart
      );

      this.startAnimationForLineChart(hourlyPurchasesChart);
    });
  }

  initYearlySalesChart() {
    this.ventasService.getVentasPorMes().subscribe((data) => {
      const labels = data.map((item) => item.mes); // 'Ene', 'Feb', etc.
      const series = data.map((item) => item.total_ventas);

      const dataYearlySalesChart = {
        labels: labels,
        series: [series],
      };

      const optionsYearlySalesChart = {
        axisX: {
          showGrid: false,
        },
        axisY: {
          onlyInteger: true, // Ensure only integer values are displayed
          labelInterpolationFnc: function (value) {
            return value > 0 ? value : '';
          },
        },
        low: 0,
        high: Math.max(...series) + 100, // Adjust to match your data
        chartPadding: {top: 0, right: 0, bottom: 0, left: 20},
      };

      const responsiveOptions: any[] = [
        [
          'screen and (max-width: 640px)',
          {
            seriesBarDistance: 5,
            axisX: {
              labelInterpolationFnc: function (value: any[]) {
                return value[0];
              },
            },
          },
        ],
      ];

      const yearlySalesChart = new Chartist.Bar(
        '#yearlySalesChart',
        dataYearlySalesChart,
        optionsYearlySalesChart,
        responsiveOptions
      );

      this.startAnimationForBarChart(yearlySalesChart);
    });
  }

  startAnimationForLineChart(chart) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;

    chart.on('draw', function (data) {
      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path
              .clone()
              .scale(1, 0)
              .translate(0, data.chartRect.height())
              .stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint,
          },
        });
      } else if (data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease',
          },
        });
      }
    });

    seq = 0;
  }

  startAnimationForBarChart(chart) {
    let seq2: any, delays2: any, durations2: any;

    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on('draw', function (data) {
      if (data.type === 'bar') {
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: 'ease',
          },
        });
      }
    });

    seq2 = 0;
  }
}

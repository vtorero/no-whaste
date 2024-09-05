import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {DataService} from './service/data.service';
import * as tf from '@tensorflow/tfjs';
import {Chart} from 'chart.js/auto';

@Component({
  selector: 'app-proyeccion',
  templateUrl: './proyeccion.component.html',
  styleUrls: ['./proyeccion.component.css'],
})
export class ProyeccionComponent implements OnInit {
  @ViewChild('chartCanvas', {static: false}) chartRef: ElementRef | undefined;
  isLoading: boolean = true;
  chartInstance: any;
  predictionRange: number = 1;
  data: any;
  predictedSales: number[] = [];
  futurePredictions: number[] = [];
  predictedWaste: number[] = [];
  futurePredictionsWaste: number[] = [];
  errorMessage: string | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.initPage();
  }

  initPage(): void {
    this.isLoading = true;
    console.log('Iniciando la página y cargando datos...');
    this.fetchDataFromService();
  }

  fetchDataFromService(): void {
    this.dataService.fetchData().subscribe(
      (response) => {
        this.data = response;

        if (this.data && this.data.sales) {
          this.trainModel();
        } else {
          this.errorMessage =
            'No se encontraron datos válidos para mostrar el gráfico.';
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching data from API:', error);
        this.errorMessage =
          'No se pudo cargar los datos desde la API. Por favor, inténtelo más tarde.';
        this.isLoading = false;
      }
    );
  }

  async trainModel(): Promise<void> {
    try {
      const {sales, waste, demands, offers} = this.data;

      if (!sales || !waste || !demands || !offers || sales.length === 0) {
        throw new Error(
          'Data arrays must be non-empty and have the same length.'
        );
      }

      // Preparar los datos de entrada para las ventas y mermas
      const inputs = sales.map((_, i: number) => [
        sales[i],
        waste[i],
        demands[i],
        offers[i],
      ]);
      const outputs = sales.slice(1);

      const inputTensor = tf.tensor2d(inputs.slice(0, -1));
      const outputTensor = tf.tensor2d(outputs, [outputs.length, 1]);

      const model = tf.sequential();
      model.add(
        tf.layers.dense({units: 16, activation: 'relu', inputShape: [4]})
      );
      model.add(tf.layers.dense({units: 16, activation: 'relu'}));
      model.add(tf.layers.dense({units: 1}));
      model.compile({loss: 'meanSquaredError', optimizer: 'adam'});

      await model.fit(inputTensor, outputTensor, {epochs: 200});

      const predictions = model.predict(inputTensor);

      let predictionsSales: Float32Array;
      if (Array.isArray(predictions)) {
        predictionsSales = predictions[0].dataSync() as Float32Array;
      } else {
        predictionsSales = predictions.dataSync() as Float32Array;
      }

      const lastSalesInput = inputs[inputs.length - 1];
      const futureInputs = Array.from(
        {length: this.predictionRange},
        (_, i) => [
          lastSalesInput[0] + i * 50,
          lastSalesInput[1] + i * 5,
          lastSalesInput[2] + i * 60,
          lastSalesInput[3] + i * 40,
        ]
      );

      const futureInputTensor = tf.tensor2d(futureInputs);
      const futurePredictions = model.predict(futureInputTensor);

      let futurePredictionsSales: Float32Array;
      if (Array.isArray(futurePredictions)) {
        futurePredictionsSales =
          futurePredictions[0].dataSync() as Float32Array;
      } else {
        futurePredictionsSales = futurePredictions.dataSync() as Float32Array;
      }

      const outputsWaste = waste.slice(1);
      const outputTensorWaste = tf.tensor2d(outputsWaste, [
        outputsWaste.length,
        1,
      ]);

      await model.fit(inputTensor, outputTensorWaste, {epochs: 200});

      const predictionsWaste = model.predict(inputTensor);

      let predictionsWasteArray: Float32Array;
      if (Array.isArray(predictionsWaste)) {
        predictionsWasteArray = predictionsWaste[0].dataSync() as Float32Array;
      } else {
        predictionsWasteArray = predictionsWaste.dataSync() as Float32Array;
      }

      const futurePredictionsWaste = model.predict(futureInputTensor);

      let futurePredictionsWasteArray: Float32Array;
      if (Array.isArray(futurePredictionsWaste)) {
        futurePredictionsWasteArray =
          futurePredictionsWaste[0].dataSync() as Float32Array;
      } else {
        futurePredictionsWasteArray =
          futurePredictionsWaste.dataSync() as Float32Array;
      }

      // Guardar las predicciones
      this.predictedSales = Array.from(predictionsSales);
      this.futurePredictions = Array.from(futurePredictionsSales);
      this.predictedWaste = Array.from(predictionsWasteArray);
      this.futurePredictionsWaste = Array.from(futurePredictionsWasteArray);

      this.renderChart(
        sales,
        this.predictedSales,
        this.futurePredictions,
        waste,
        this.predictedWaste,
        this.futurePredictionsWaste
      );
    } catch (error) {
      console.error('Error during model training:', error);
      this.errorMessage = 'Hubo un error al entrenar el modelo.';
    }
  }

  renderChart(
    actualSales: number[],
    predictedSales: number[],
    futurePredictions: number[],
    actualWaste: number[],
    predictedWaste: number[],
    futurePredictionsWaste: number[]
  ): void {
    if (!this.chartRef?.nativeElement) {
      console.error('No se encontró el elemento del gráfico.');
      return;
    }

    const chartData = {
      labels: [
        ...Array(actualSales.length).fill('Actual'),
        ...Array(this.predictionRange).fill('Futuro'),
      ],
      datasets: [
        {
          label: 'Ventas Actuales',
          data: actualSales,
          borderColor: 'blue',
          fill: false,
        },
        {
          label: 'Ventas Predecidas',
          data: [...predictedSales, ...futurePredictions],
          borderColor: 'lightblue',
          fill: false,
        },
        {
          label: 'Mermas Actuales',
          data: actualWaste,
          borderColor: 'red',
          fill: false,
        },
        {
          label: 'Mermas Predecidas',
          data: [...predictedWaste, ...futurePredictionsWaste],
          borderColor: 'orange',
          fill: false,
          borderDash: [5, 5],
        },
      ],
    };

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    this.chartInstance = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: chartData,
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
          },
          y: {
            title: {
              display: true,
              text: 'Ventas y Mermas',
            },
          },
        },
      },
    });
  }

  onPredictionRangeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.predictionRange = +target.value;
    this.trainModel();
  }
}

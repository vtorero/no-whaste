import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as tf from '@tensorflow/tfjs';
import {Chart} from 'chart.js/auto';
import {Global} from 'app/global';
@Component({
  selector: 'app-proyeccion',
  templateUrl: './proyeccion.component.html',
  styleUrls: ['./proyeccion.component.css'],
})
export class ProyeccionComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas', {static: false}) chartRef: ElementRef | undefined;
  isLoading: boolean = true;
  chartInstance: any;
  predictionRange: number = 3; // Predict the next 3 months by default
  data: any;
  predictedSales: number[] = [];
  futurePredictions: number[] = [];
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchDataFromAPI();
  }

  ngAfterViewInit(): void {
    if (this.chartRef?.nativeElement && this.data) {
      this.trainModel();
    }
  }

  async fetchDataFromAPI(): Promise<void> {
    try {
      const response = await this.http
        .get(Global.BASE_API_URL + 'data.php/api')
        .toPromise();
      this.data = response;

      if (this.chartRef?.nativeElement) {
        this.trainModel();
      }
    } catch (error) {
      console.error('Error fetching data from API:', error);
      this.errorMessage =
        'Failed to load data from API. Please try again later.';
    } finally {
      this.isLoading = false;
    }
  }

  async trainModel(): Promise<void> {
    try {
      const {sales, waste, demands, offers} = this.data;
      // Ensure that all arrays have the same length and are not empty
      if (
        !sales ||
        !waste ||
        !demands ||
        !offers ||
        sales.length === 0 ||
        sales.length !== waste.length ||
        sales.length !== demands.length ||
        sales.length !== offers.length
      ) {
        throw new Error(
          'Data arrays must be of the same length and non-empty.'
        );
      }

      // Filter out any undefined, null, or non-numerical entries
      const validEntries = sales.every(
        (v, i) =>
          typeof v === 'number' &&
          typeof waste[i] === 'number' &&
          typeof demands[i] === 'number' &&
          typeof offers[i] === 'number'
      );

      if (!validEntries) {
        throw new Error('All entries must be valid numbers.');
      }

      // Prepare input data for model training
      const inputs = sales.map((_, i: number) => [
        sales[i],
        waste[i],
        demands[i],
        offers[i],
      ]);
      const outputs = sales.slice(1); // Predict the next month's sales, so skip the first one

      const inputTensor = tf.tensor2d(inputs.slice(0, -1)); // Remove the last item for input
      const outputTensor = tf.tensor2d(outputs, [outputs.length, 1]);

      const model = tf.sequential();
      model.add(
        tf.layers.dense({units: 16, activation: 'relu', inputShape: [4]})
      );
      model.add(tf.layers.dense({units: 16, activation: 'relu'}));
      model.add(tf.layers.dense({units: 1}));
      model.compile({loss: 'meanSquaredError', optimizer: 'adam'});

      await model.fit(inputTensor, outputTensor, {epochs: 100});

      // Predicting the sales for the actual data
      const predictions = model.predict(inputTensor);

      let predictionsSales: Float32Array;
      if (Array.isArray(predictions)) {
        predictionsSales = predictions[0].dataSync() as Float32Array; // Handle array of tensors
      } else {
        predictionsSales = predictions.dataSync() as Float32Array; // Handle single tensor
      }

      const lastSalesInput = inputs[inputs.length - 1];
      const futureInputs = Array.from(
        {length: this.predictionRange},
        (_, i) => [
          lastSalesInput[0] + i * 50, // Simulate future sales
          lastSalesInput[1] + i * 5, // Simulate future waste
          lastSalesInput[2] + i * 60, // Simulate future demand
          lastSalesInput[3] + i * 40, // Simulate future offer
        ]
      );

      const futureInputTensor = tf.tensor2d(futureInputs);
      const futurePredictions = model.predict(futureInputTensor);

      let futurePredictionsData: Float32Array;
      if (Array.isArray(futurePredictions)) {
        futurePredictionsData = futurePredictions[0].dataSync() as Float32Array; // Handle array of tensors
      } else {
        futurePredictionsData = futurePredictions.dataSync() as Float32Array; // Handle single tensor
      }

      this.predictedSales = Array.from(predictionsSales);
      this.futurePredictions = Array.from(futurePredictionsData);

      this.renderChart(sales, this.predictedSales, this.futurePredictions);
    } catch (error) {
      console.error('Error during model training:', error);
      this.errorMessage =
        'Failed to train the model. Please check the data and try again.';
    } finally {
      this.isLoading = false;
    }
  }

  renderChart(
    actualSales: number[],
    predictedSales: number[],
    futurePredictions: number[]
  ): void {
    if (!this.chartRef?.nativeElement) {
      console.error('Chart element not found.');
      return;
    }

    const chartData = {
      labels: [
        ...Array(actualSales.length).fill('Actual'),
        ...Array(this.predictionRange).fill('Future'),
      ],
      datasets: [
        {
          label: 'Actual Sales',
          data: actualSales,
          borderColor: 'blue',
          fill: false,
        },
        {
          label: 'Predicted Sales',
          data: [...predictedSales, ...futurePredictions],
          borderColor: 'lightblue',
          fill: false,
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
              text: 'Month',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Sales',
            },
          },
        },
      },
    });
  }

  onPredictionRangeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.predictionRange = +target.value; // Convert to number
    this.trainModel(); // Retrain the model with the new prediction range
  }
}

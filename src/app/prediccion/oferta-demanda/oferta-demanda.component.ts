import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {DataService} from './service/data.service';
import * as tf from '@tensorflow/tfjs';
import {Chart} from 'chart.js/auto';

@Component({
  selector: 'app-oferta-demanda',
  templateUrl: './oferta-demanda.component.html',
  styleUrls: ['./oferta-demanda.component.css'],
})
export class OfertaDemandaComponent implements OnInit {
  @ViewChild('chartCanvas', {static: false}) chartRef: ElementRef | undefined;
  isLoading: boolean = true;
  chartInstance: any;
  predictionRange: number = 1;
  data: any;
  predictedOffer: number[] = [];
  futurePredictionsOffer: number[] = [];
  predictedDemand: number[] = [];
  futurePredictionsDemand: number[] = [];
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
    this.dataService.fetchDataFromService().subscribe(
      (response) => {
        this.data = response;

        if (this.data && this.data.offers && this.data.demands) {
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
      const {offers, demands} = this.data;

      if (!offers || !demands || offers.length === 0 || demands.length === 0) {
        throw new Error(
          'Data arrays must be non-empty and have the same length.'
        );
      }

      // Preparar los datos de entrada para oferta y demanda
      const inputs = offers.map((_, i: number) => [offers[i], demands[i]]);
      const outputOffers = offers.slice(1);
      const outputDemands = demands.slice(1);

      const inputTensor = tf.tensor2d(inputs.slice(0, -1));
      const outputTensorOffers = tf.tensor2d(outputOffers, [
        outputOffers.length,
        1,
      ]);
      const outputTensorDemands = tf.tensor2d(outputDemands, [
        outputDemands.length,
        1,
      ]);

      const model = tf.sequential();
      model.add(
        tf.layers.dense({units: 16, activation: 'relu', inputShape: [2]})
      );
      model.add(tf.layers.dense({units: 16, activation: 'relu'}));
      model.add(tf.layers.dense({units: 1}));
      model.compile({loss: 'meanSquaredError', optimizer: 'adam'});

      await model.fit(inputTensor, outputTensorOffers, {epochs: 200});

      const predictionsOffer = model.predict(inputTensor);

      let predictionsOfferArray: Float32Array;
      if (Array.isArray(predictionsOffer)) {
        predictionsOfferArray = predictionsOffer[0].dataSync() as Float32Array;
      } else {
        predictionsOfferArray = predictionsOffer.dataSync() as Float32Array;
      }

      const lastOfferInput = inputs[inputs.length - 1];
      const futureInputs = Array.from(
        {length: this.predictionRange},
        (_, i) => [lastOfferInput[0] + i * 50, lastOfferInput[1] + i * 60]
      );

      const futureInputTensor = tf.tensor2d(futureInputs);
      const futurePredictionsOffer = model.predict(futureInputTensor);

      let futurePredictionsOfferArray: Float32Array;
      if (Array.isArray(futurePredictionsOffer)) {
        futurePredictionsOfferArray =
          futurePredictionsOffer[0].dataSync() as Float32Array;
      } else {
        futurePredictionsOfferArray =
          futurePredictionsOffer.dataSync() as Float32Array;
      }

      // Reentrenar para demanda
      await model.fit(inputTensor, outputTensorDemands, {epochs: 200});

      const predictionsDemand = model.predict(inputTensor);

      let predictionsDemandArray: Float32Array;
      if (Array.isArray(predictionsDemand)) {
        predictionsDemandArray =
          predictionsDemand[0].dataSync() as Float32Array;
      } else {
        predictionsDemandArray = predictionsDemand.dataSync() as Float32Array;
      }

      const futurePredictionsDemand = model.predict(futureInputTensor);

      let futurePredictionsDemandArray: Float32Array;
      if (Array.isArray(futurePredictionsDemand)) {
        futurePredictionsDemandArray =
          futurePredictionsDemand[0].dataSync() as Float32Array;
      } else {
        futurePredictionsDemandArray =
          futurePredictionsDemand.dataSync() as Float32Array;
      }

      // Guardar las predicciones
      this.predictedOffer = Array.from(predictionsOfferArray);
      this.futurePredictionsOffer = Array.from(futurePredictionsOfferArray);
      this.predictedDemand = Array.from(predictionsDemandArray);
      this.futurePredictionsDemand = Array.from(futurePredictionsDemandArray);

      this.renderChart(
        offers,
        this.predictedOffer,
        this.futurePredictionsOffer,
        demands,
        this.predictedDemand,
        this.futurePredictionsDemand
      );
    } catch (error) {
      console.error('Error during model training:', error);
      this.errorMessage = 'Hubo un error al entrenar el modelo.';
    }
  }

  renderChart(
    actualOffers: number[],
    predictedOffers: number[],
    futurePredictionsOffers: number[],
    actualDemands: number[],
    predictedDemands: number[],
    futurePredictionsDemands: number[]
  ): void {
    if (!this.chartRef?.nativeElement) {
      console.error('No se encontró el elemento del gráfico.');
      return;
    }

    const chartData = {
      labels: [
        ...Array(actualOffers.length).fill('Actual'),
        ...Array(this.predictionRange).fill('Futuro'),
      ],
      datasets: [
        {
          label: 'Oferta Actual',
          data: actualOffers,
          borderColor: 'green',
          fill: false,
        },
        {
          label: 'Oferta Predecida',
          data: [...predictedOffers, ...futurePredictionsOffers],
          borderColor: 'lightgreen',
          fill: false,
        },
        {
          label: 'Demanda Actual',
          data: actualDemands,
          borderColor: 'blue',
          fill: false,
        },
        {
          label: 'Demanda Predecida',
          data: [...predictedDemands, ...futurePredictionsDemands],
          borderColor: 'lightblue',
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
              text: 'Ofertas y Demandas',
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

import {Component, OnInit, Input} from '@angular/core';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-modelo-clasificacion',
  templateUrl: './modelo-clasificacion.component.html',
  styleUrls: ['./modelo-clasificacion.component.css'],
})
export class ModeloClasificacionComponent implements OnInit {
  @Input() data: {sales: number[]} = {sales: []}; // Esto permite pasar los datos reales desde el padre

  mse: number | null = null;
  r2: number | null = null;
  predictedSales: number | null = null;

  constructor() {}

  ngOnInit(): void {
    if (this.data.sales.length > 0) {
      this.runClassification();
    } else {
      console.error('No hay suficientes datos para realizar la clasificación.');
    }
  }

  async runClassification() {
    const classifier = knnClassifier.create();
    const sales = this.data.sales;
    const tensorSales = tf.tensor1d(sales);

    // Normalización de los datos
    const {mean, variance} = tf.moments(tensorSales);
    const std = tf.sqrt(variance);
    const normTensorSales = tensorSales.sub(mean).div(std);

    // Añadir ejemplos al clasificador KNN
    for (let i = 0; i < sales.length - 1; i++) {
      const example = tf.tensor1d([
        normTensorSales.slice([i], [1]).dataSync()[0],
      ]); // Convertir a tensor
      const label = normTensorSales.slice([i + 1], [1]).dataSync()[0]; // Extraer el número del tensor

      classifier.addExample(example, label); // Pasar tensores
    }

    // Predicción de una nueva venta
    const newSale = 80; // Aquí podrías reemplazar este valor con los datos reales si fuera necesario
    const normNewSale = tf.scalar(newSale).sub(mean).div(std); // Convertir a tensor
    const prediction = await classifier.predictClass(normNewSale); // Pasar el tensor

    const denormalizedPrediction = std
      .mul(tf.tensor1d([prediction.confidences[prediction.label]]))
      .add(mean);

    this.predictedSales = denormalizedPrediction.dataSync()[0];

    // Calcular MSE y R²
    const predictions: number[] = [];
    for (let i = 0; i < sales.length - 1; i++) {
      const tensorExample = tf.tensor1d([
        normTensorSales.slice([i], [1]).dataSync()[0],
      ]); // Convertir a tensor
      const prediction = await classifier.predictClass(tensorExample); // Pasar el tensor

      const denormalizedPrediction = std
        .mul(tf.tensor1d([prediction.confidences[prediction.label]]))
        .add(mean);
      predictions.push(denormalizedPrediction.dataSync()[0]);
    }

    const mseTensor = tf.losses.meanSquaredError(sales.slice(1), predictions);
    const mseValue = await mseTensor.data();
    this.mse = mseValue[0];

    const totalSumSquares = tf
      .sum(tf.squaredDifference(tensorSales.mean(), tensorSales))
      .dataSync()[0];
    const residualSumSquares = tf
      .sum(
        tf.squaredDifference(
          tensorSales.slice([1], [sales.length - 1]),
          tf.tensor1d(predictions)
        )
      )
      .dataSync()[0];
    this.r2 = 1 - residualSumSquares / totalSumSquares;
  }
}

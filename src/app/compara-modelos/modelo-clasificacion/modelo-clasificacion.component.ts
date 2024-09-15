import {Component, OnInit} from '@angular/core';
import {DataService} from './service/DataService';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-modelo-clasificacion',
  templateUrl: './modelo-clasificacion.component.html',
  styleUrls: ['./modelo-clasificacion.component.css'],
})
export class ModeloClasificacionComponent implements OnInit {
  mse: number | null = null;
  r2: number | null = null;
  predictedSales: number | null = null;
  sales: number[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getData().subscribe((response) => {
      this.sales = response.sales; // Obtener las ventas del API
      if (this.sales.length > 0) {
        this.runClassification(); // Ejecutar el modelo una vez que se obtienen los datos
      } else {
        console.error(
          'No hay suficientes datos para realizar la clasificación.'
        );
      }
    });
  }

  async runClassification() {
    const classifier = knnClassifier.create();
    const sales = this.sales;
    const tensorSales = tf.tensor1d(sales);

    // Normalización de los datos
    const {mean, variance} = tf.moments(tensorSales);
    const std = tf.sqrt(variance);
    const normTensorSales = tensorSales.sub(mean).div(std);

    // Añadir ejemplos al clasificador KNN
    for (let i = 0; i < sales.length - 1; i++) {
      const exampleValue = (await normTensorSales.slice([i], [1]).data())[0];
      const labelValue = (await normTensorSales.slice([i + 1], [1]).data())[0];

      const example = tf.tensor1d([exampleValue]); // Crear un tensor 1D
      classifier.addExample(example, labelValue); // Añadir ejemplo y etiqueta
      example.dispose(); // Liberar memoria del tensor
    }

    // Predicción de una nueva venta
    const newSale = 80; // Ejemplo, cambiar si necesario
    const normNewSale = tf.scalar(newSale).sub(mean).div(std);
    const prediction = await classifier.predictClass(normNewSale);

    const denormalizedPrediction = std
      .mul(tf.tensor1d([prediction.confidences[prediction.label]]))
      .add(mean);

    this.predictedSales = (await denormalizedPrediction.data())[0]; // Extraer el valor

    // Liberar memoria
    normNewSale.dispose();
    denormalizedPrediction.dispose();

    // Calcular MSE y R²
    const predictions: number[] = [];
    for (let i = 0; i < sales.length - 1; i++) {
      const tensorExample = tf.tensor1d([
        await normTensorSales.slice([i], [1]).data()[0],
      ]);
      const prediction = await classifier.predictClass(tensorExample);
      const denormalizedPrediction = std
        .mul(tf.tensor1d([prediction.confidences[prediction.label]]))
        .add(mean);

      predictions.push((await denormalizedPrediction.data())[0]); // Extraer el valor

      tensorExample.dispose();
      denormalizedPrediction.dispose();
    }

    const mseTensor = tf.losses.meanSquaredError(sales.slice(1), predictions);
    const mseValue = await mseTensor.data();
    this.mse = mseValue[0]; // Extraer el valor
    mseTensor.dispose(); // Liberar memoria

    const totalSumSquares = (
      await tf.sum(tf.squaredDifference(tensorSales.mean(), tensorSales)).data()
    )[0]; // Extraer el valor del tensor
    const residualSumSquares = (
      await tf
        .sum(
          tf.squaredDifference(
            tensorSales.slice([1], [sales.length - 1]),
            tf.tensor1d(predictions)
          )
        )
        .data()
    )[0]; // Extraer el valor del tensor

    this.r2 = 1 - residualSumSquares / totalSumSquares;

    // Liberar memoria
    tensorSales.dispose();
    normTensorSales.dispose();
    std.dispose();
    mean.dispose();
  }
}

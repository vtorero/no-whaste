import {Component, OnInit} from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import {HttpClient} from '@angular/common/http';

const API_URL = 'https://franz.kvconsult.com/fapi-dev/data.php/api';

@Component({
  selector: 'app-lineal-simple',
  templateUrl: './lineal-simple.component.html',
  styleUrls: ['./lineal-simple.component.css'],
})
export class LinealSimpleComponent implements OnInit {
  predictedSales: number | null = null;
  mape: number | null = null;
  accuracy: number | null = null;
  mae: number | null = null;
  mse: number | null = null;
  rmse: number | null = null;
  salesData: number[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchData();
  }

  // Fetch data from the API
  async fetchData() {
    try {
      const response: any = await this.http.get(API_URL).toPromise();
      const sales = response.ventas_x_dia.map((d: any) => d.total);
      this.salesData = sales;

      if (this.salesData.length > 1) {
        this.runLinearRegression();
      }
    } catch (error) {
      console.error('Error fetching data from API:', error);
    }
  }

  // Train and run linear regression model using TensorFlow.js
  async runLinearRegression() {
    const sales = this.salesData;
    const time = Array.from({length: sales.length}, (_, i) => i + 1);

    const maxTime = Math.max(...time);
    const maxSales = Math.max(...sales);

    const xs = tf.tensor2d(
      time.map((t) => t / maxTime),
      [time.length, 1]
    );
    const ys = tf.tensor2d(
      sales.map((s) => s / maxSales),
      [sales.length, 1]
    );

    const model = tf.sequential();
    model.add(tf.layers.dense({units: 1, inputShape: [1]}));

    model.compile({
      optimizer: tf.train.sgd(0.01),
      loss: 'meanSquaredError',
    });

    await model.fit(xs, ys, {
      epochs: 200,
      validationSplit: 0.2,
    });

    let predictedYs = model.predict(xs);
    predictedYs = Array.isArray(predictedYs) ? predictedYs[0] : predictedYs;
    predictedYs = tf.squeeze(predictedYs).mul(maxSales); 

    const actualYs = sales;

    // MAPE (Mean Absolute Percentage Error)
    const mapeTensor = tf.metrics.meanAbsolutePercentageError(
      tf.tensor2d(actualYs, [actualYs.length, 1]),
      predictedYs
    );
    const mape = mapeTensor.dataSync()[0];
    this.mape = mape;
    this.accuracy = 100 - mape;

    // MAE (Mean Absolute Error)
    const maeTensor = tf.metrics.meanAbsoluteError(
      tf.tensor2d(actualYs, [actualYs.length, 1]),
      predictedYs
    );
    this.mae = maeTensor.dataSync()[0];

    // MSE (Mean Squared Error)
    const mseTensor = tf.metrics.meanSquaredError(
      tf.tensor2d(actualYs, [actualYs.length, 1]),
      predictedYs
    );
    this.mse = mseTensor.dataSync()[0];

    // RMSE (Root Mean Squared Error)
    this.rmse = Math.sqrt(this.mse);

    // Predict next time point
    const nextTimePoint = (sales.length + 1) / maxTime;
    let predictedSalesTensor = model.predict(
      tf.tensor2d([nextTimePoint], [1, 1])
    );
    predictedSalesTensor = Array.isArray(predictedSalesTensor)
      ? predictedSalesTensor[0]
      : predictedSalesTensor;
    this.predictedSales = Math.max(
      0,
      predictedSalesTensor.mul(maxSales).dataSync()[0]
    );
  }
}

import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Matrix} from 'ml-matrix';
import MultivariateLinearRegression from 'ml-regression-multivariate-linear';
import ExtractCoefficient from './utils/ExtractCoefficient';
import {Global} from 'app/global';

@Component({
  selector: 'app-lineal-multiple',
  templateUrl: './lineal-multiple.component.html',
  styleUrls: ['./lineal-multiple.component.css'],
})
export class LinealMultipleComponent implements OnInit {
  predictionDenormalized: number = 0;
  meanSquaredError: number = 0;
  accuracy: number = 0;

  data = {
    offers: [],
    wastes: [],
    demands: [],
    sales: [],
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchDataAndRunRegression();
  }

  fetchDataAndRunRegression() {
    Promise.all([
      this.http.get(Global.BASE_API_URL + 'api.php/ventas/total').toPromise(),
      this.http.get(Global.BASE_API_URL + 'api.php/mermas/total').toPromise(),
      this.http.get(Global.BASE_API_URL + 'api.php/oferta/total').toPromise(),
      this.http.get(Global.BASE_API_URL + 'api.php/demanda/total').toPromise(),
    ])
      .then((responses: any[]) => {
        this.data.sales = responses[0].map((item: any) =>
          parseFloat(item.total_ventas_mes)
        );
        this.data.wastes = responses[1].map((item: any) =>
          parseFloat(item.total_mermas)
        );
        this.data.offers = responses[2].map((item: any) =>
          parseFloat(item.total_oferta_mes)
        );
        this.data.demands = responses[3].map((item: any) =>
          parseFloat(item.total_demanda_mes)
        );

        this.runRegression();
      })
      .catch((error) => {
        console.error('Error al obtener datos de las APIs:', error);
      });
  }

  runRegression() {
    const {offers, wastes, demands, sales} = this.data;

    if (
      offers.length === 0 ||
      wastes.length === 0 ||
      demands.length === 0 ||
      sales.length === 0
    ) {
      console.error('Los datos están vacíos o incompletos.');
      return;
    }

    const lengthCheck = [offers, wastes, demands, sales].every(
      (arr) => arr.length === offers.length
    );

    if (!lengthCheck) {
      console.error('Las matrices de entrada deben tener la misma longitud');
      return;
    }

    const normalize = (arr: number[]) => {
      const min = Math.min(...arr);
      const max = Math.max(...arr);
      if (max === min) {
        return arr.map(() => 0.5);
      }
      return arr.map((value) => (value - min) / (max - min));
    };

    const normOffers = normalize(offers);
    const normWastes = normalize(wastes);
    const normDemands = normalize(demands);
    const normSales = normalize(sales);

    const testData = new Matrix([
      normOffers,
      normWastes,
      normDemands,
    ]).transpose();
    const outputs = new Matrix([normSales]).transpose();

    const regression = new MultivariateLinearRegression(testData, outputs);

    // Hacer predicción con los últimos datos obtenidos
    const prediction = regression.predict([
      normOffers[normOffers.length - 1],
      normWastes[normWastes.length - 1],
      normDemands[normDemands.length - 1],
    ])[0];

    const salesRange = sales[sales.length - 1] - sales[0];
    const predictionDenorm =
      salesRange === 0 ? sales[0] : prediction * salesRange + sales[0];

    // Calcular el error cuadrático medio y la precisión
    const yHat = regression.predict(testData);
    const residuals = outputs.sub(yHat);
    const residualsArray = residuals.to1DArray();
    const residualsSquaredArray = residualsArray.map((residual) =>
      Math.pow(residual, 2)
    );
    const residualsSquaredSum = residualsSquaredArray.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    const mse = residualsSquaredSum / residualsArray.length;

    const explainedSumOfSquares =
      outputs.to1DArray().reduce((a, b) => a + b, 0) -
      Math.pow(
        outputs.to1DArray().reduce((a, b) => a + b, 0),
        2
      ) /
        outputs.to1DArray().length;
    const totalSumOfSquares = explainedSumOfSquares + residualsSquaredSum;

    if (totalSumOfSquares === 0) {
      console.error('El total de la suma de cuadrados es cero.');
      return;
    }

    const accuracy =
      (1 - residualsSquaredSum / totalSumOfSquares) * 100 -
      ExtractCoefficient(mse);

    this.predictionDenormalized = predictionDenorm;
    this.meanSquaredError = mse;
    this.accuracy = accuracy;
  }
}

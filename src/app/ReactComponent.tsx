import * as React from 'react'
import { Matrix } from "ml-matrix";
import MultivariateLinearRegression from 'ml-regression-multivariate-linear';


    const MultipleLinearRegression = () => {
      const categories = [1, 2, 3, 1, 2, 3, 1, 2, 3, 1];
      const subcategories = [1, 2, 3, 1, 2, 3, 1, 2, 3, 1];
      const kilosFlag = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0];
      const products = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const wastes = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      const demands = [100, 120, 150, 180, 200, 220, 250, 280, 300, 340];
      const offers = [80, 100, 120, 140, 160, 180, 200, 220, 240, 260];
      const seasons = [1, 2, 3, 4, 1, 2, 3, 4, 1, 2];
      const sales = [
        50000,
        60000,
        70000,
        80000,
        90000,
        100000,
        110000,
        120000,
        130000,
        140000
      ];

      // Normalize categories and subcategories and offers
      const normCategories = categories.map(
        (c) => (c - 1) / (Math.max(...categories) - 1)
      );
      const normSubcategories = subcategories.map(
        (s) => (s - 1) / (Math.max(...subcategories) - 1)
      );

      const minOffer = Math.min(...offers);
      const maxOffer = Math.max(...offers);
      const normOffers = offers.map(
        (offer) => (offer - minOffer) / (maxOffer - minOffer)
      );

      // Normalize kilosFlag
      const normKilosFlag = kilosFlag.map((k) => k / Math.max(...kilosFlag));
      const normProducts = products.map((p) => (p - 1) / (products.length - 1));
      // Normalize wastes, demands, seasons, years, sales
      const normWastes = wastes.map(
        (w) => (w - wastes[0]) / (wastes[wastes.length - 1] - wastes[0])
      );
      const normDemands = demands.map(
        (d) => (d - demands[0]) / (demands[demands.length - 1] - demands[0])
      );
      const normSeasons = seasons.map(
        (s) => (s - seasons[0]) / (seasons[seasons.length - 1] - seasons[0])
      );

      const normSales = sales.map(
        (s) => (s - sales[0]) / (sales[sales.length - 1] - sales[0])
      );
      const data = new Matrix([
        normWastes,
        normDemands,
        normOffers,
        normSeasons,
        normCategories,
        normSubcategories,
        normProducts,
        normKilosFlag
      ]).transpose();

      const outputs = new Matrix([normSales]).transpose();

      const regression = new MultivariateLinearRegression(data, outputs);

      const prediction:any= regression.predict([[50, 180, 20, 1, 1, 1, 1, 1]])[0];
      const predictionDenormalized = prediction * (sales[sales.length - 1] - sales[0]) + sales[0];

      const yHat = regression.predict(data);
      const residuals = outputs.sub(yHat);
      const residualsArray = residuals.to1DArray();
      const residualsSquaredArray = residualsArray.map((residual) =>
        Math.pow(residual, 2)
      );
      const residualsSquaredSum = residualsSquaredArray.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );
      const meanSquaredError = residualsSquaredSum / residualsArray.length;

      const explainedSumOfSquares =
        outputs.to1DArray().reduce((a, b) => a + b, 0) -
        Math.pow(
          outputs.to1DArray().reduce((a, b) => a + b, 0),
          2
        ) /
          outputs.to1DArray().length;
      const totalSumOfSquares =
        residualsSquaredSum +
        explainedSumOfSquares +
        Math.pow(
          outputs.to1DArray().reduce((a, b) => a + b, 0),
          2
        ) /
          outputs.to1DArray().length;
      const accuracy = (1 - residualsSquaredSum / totalSumOfSquares) * 100;

      return (
        <div>
          <h3><strong>Modelo de Regresion Lineal Multiple</strong></h3>
          <p>{`El precio de venta previsto es: $ ${predictionDenormalized}`}</p>
          <p>{`Mean squared error: ${meanSquaredError}`}</p>
          <p>{`Accuracy: ${accuracy} `}</p>
        </div>
      );


    };

    export default MultipleLinearRegression;

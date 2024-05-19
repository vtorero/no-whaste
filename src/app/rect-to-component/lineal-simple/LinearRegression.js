import React from "react";
import { linearRegression } from "simple-statistics";

const LinearRegression = () => {
  // Datos históricos de ventas
  const ventas = [100, 120, 150, 180, 200];

  // Tiempo en años, incluyendo el 6to día
  const tiempo = [1, 2, 3, 4, 5, 6];

  // Combine ventas and tiempo arrays into a 2D array
  const data = [];
  for (let i = 0; i < ventas.length; i++) {
    data.push([tiempo[i], ventas[i]]);
  }

  // Shuffle data array randomly
  const shuffledData = shuffle(data);

  // Split data into training and testing sets
  const splitIndex = Math.floor(shuffledData.length * 0.8); // 80% training, 20% testing
  const trainingData = shuffledData.slice(0, splitIndex);
  const testingData = shuffledData.slice(splitIndex);

  // Modelo de regresión lineal simple using training data
  const { m, b } = linearRegression(trainingData);

  // Predict values for testing data
  const predictedValues = testingData.map((point) => m * point[0] + b);

  // Calculate mean squared error and R-squared value
  const mse = meanSquaredError(
    testingData.map((point) => point[1]),
    predictedValues
  );
  const rSquared = coefficientOfDeterminant(
    testingData.map((point) => point[1]),
    predictedValues
  );
  // Calculate accuracy
  const accuracy =
    100 - (mse / mean(testingData.map((point) => point[1]))) * 100;
  // Predicción para el año 6 using entire data set
  const x = 6;
  const ventasPredichas = m * x + b;

  return (
    <div>
      <h1>Modelo de Regresion Lineal Simple</h1>
      <p>
        Las ventas predichas para el año 6 son: {ventasPredichas.toFixed(2)}
      </p>
      <p>Mean squared error: {mse.toFixed(2)}</p>
      <p>R-squared value: {(rSquared * 100).toFixed(2)}%</p>
      <p>Accuracy: {accuracy.toFixed(2)}%</p>
    </div>
  );
};

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function meanSquaredError(actual, predicted) {
  const squaredErrors = actual.map((actualValue, index) => {
    const predictedValue = predicted[index];
    return Math.pow(actualValue - predictedValue, 2);
  });
  const sumSquaredErrors = squaredErrors.reduce(
    (sum, squaredError) => sum + squaredError,
    0
  );
  return sumSquaredErrors / actual.length;
}

function mean(array) {
  const sum = array.reduce((sum, value) => sum + value, 0);
  return sum / array.length;
}

function coefficientOfDeterminant(actual, predicted) {
  const actualMean = mean(actual);
  const totalSumOfSquares = actual.reduce(
    (sum, actualValue) => sum + Math.pow(actualValue - actualMean, 2),
    0
  );
  const residualSumOfSquares = actual.reduce((sum, actualValue, index) => {
    const predictedValue = predicted[index];
    return sum + Math.pow(actualValue - predictedValue, 2);
  }, 0);
  const explainedSumOfSquares = totalSumOfSquares - residualSumOfSquares;
  return explainedSumOfSquares / totalSumOfSquares;
}

export default LinearRegression;

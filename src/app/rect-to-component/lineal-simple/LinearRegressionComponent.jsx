 import React from 'react';
import reactToWebComponent from 'react-to-webcomponent';
import LinearRegression from './LinearRegression';
const linearRegression = reactToWebComponent(LinearRegression, React);
customElements.define('linear-regression',linearRegression);
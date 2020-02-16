import ReactDOM from 'react-dom';
import React from 'react';
import App from '../src';

export default (mountElement, props) =>
  ReactDOM.render(<App {...props} />, mountElement);

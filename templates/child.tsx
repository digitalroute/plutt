import ReactDOM from 'react-dom';
import React from 'react';
import App from '@plutt';

export const mount = (mountElement, props) =>
  ReactDOM.render(<App {...props} />, mountElement);

export const unmount = (mountElement) =>
  ReactDOM.unmountComponentAtNode(mountElement);

export const update = (mountElement, props) =>
  ReactDOM.render(<App {...props} />, mountElement);

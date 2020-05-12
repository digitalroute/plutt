import ReactDOM from 'react-dom';
import React from 'react';
import App from '@plutt';

export default {
  mount: (mountElement, props) =>
    ReactDOM.render(<App {...props} />, mountElement),
  unmount: (mountElement) => ReactDOM.unmountComponentAtNode(mountElement),
  update: (mountElement, props) =>
    ReactDOM.render(<App {...props} />, mountElement)
};

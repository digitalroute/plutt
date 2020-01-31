import ReactDOM from 'react-dom';
import App from '.';

export default (mountElement, callback) => {
  let ref = null;
  ReactDOM.render(
    <App ref={component => (ref = component)} />,
    mountElement,
    () => {
      callback(ref);
    }
  );
};

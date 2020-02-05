import React from 'react';
import ReactDOM from 'react-dom';

export default class Wrapper extends React.Component {
  constructor(props) {
    super(props);

    this.mountRef = React.createRef();

    import(/* webpackIgnore: true */ '<remote.js>').then(
      ({ default: mountApp }) => {
        this.shadow = this.mountRef.current.attachShadow({ mode: 'open' });
        this.mountApp = mountApp;

        mountApp(this.shadow, props);
      }
    );
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.shadow);
  }

  render() {
    if (this.mountApp) {
      this.mountApp(this.shadow, this.props, () => undefined);
    }

    return <div ref={this.mountRef}></div>;
  }
}

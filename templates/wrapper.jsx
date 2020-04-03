import React from 'react';
import ReactDOM from 'react-dom';

export default class Wrapper extends React.Component {
  constructor(props) {
    super(props);

    this.mountRef = React.createRef();

    // const hostPath = process.env.HOST_PATH;

    import(/* webpackIgnore: true */ process.env.HOST_PATH).then((mod) => {
      const { default: mountApp } = mod;

      this.shadow = this.mountRef.current.attachShadow({ mode: 'open' });
      this.mountApp = mountApp;

      mountApp(this.shadow, props);
    });
  }

  componentWillUnmount() {
    if (this.shadow) ReactDOM.unmountComponentAtNode(this.shadow);
  }

  render() {
    if (this.mountApp) {
      this.mountApp(this.shadow, this.props);
    }

    return <div ref={this.mountRef}></div>;
  }
}

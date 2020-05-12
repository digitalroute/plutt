const React = require('react');

class Proxy extends React.Component {
  constructor(props) {
    super(props);

    this.mountRef = React.createRef();
  }

  componentDidMount() {
    import(/* webpackIgnore: true */ process.env.HOST_PATH).then((mod) => {
      const {
        default: { mount: mountApp, unmount: unmountApp, update: updateApp }
      } = mod;

      this.mountElement = this.props.shadow
        ? this.mountRef.current.attachShadow({ mode: 'open' })
        : this.mountRef.current;

      this.mountApp = mountApp;
      this.unmountApp = unmountApp;
      this.updateApp = updateApp;

      mountApp(this.mountElement, this.props);
    });
  }

  componentWillUnmount() {
    if (this.mountElement) this.unmountApp(this.mountElement);
  }

  render() {
    if (this.updateApp) {
      this.updateApp(this.mountElement, this.props);
    }

    return React.createElement('div', { ref: this.mountRef });
  }
}

module.exports = Proxy;

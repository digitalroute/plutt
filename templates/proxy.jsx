const React = require('react');

class Proxy extends React.Component {
  constructor(props) {
    super(props);

    this.mountRef = React.createRef();
  }

  componentDidMount() {
    import(/* webpackIgnore: true */ process.env.HOST_PATH).then((mod) => {
      const {
        default: { mount: mountApp, unmount: unmountApp, updateApp }
      } = mod;

      this.shadow = this.props.shadow
        ? this.mountRef.current.attachShadow({ mode: 'open' })
        : this.mountRef.current;

      this.mountApp = mountApp;
      this.unmountApp = unmountApp;
      this.updateApp = updateApp;

      mountApp(this.shadow, this.props);
    });
  }

  componentWillUnmount() {
    if (this.shadow) this.unmountApp(this.shadow);
  }

  render() {
    if (this.mountApp) {
      this.updateApp(this.shadow, this.props);
    }

    return React.createElement('div', { ref: this.mountRef });
  }
}

module.exports = Proxy;

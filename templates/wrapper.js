export default class Wrapper extends React.Component {
  constructor(props) {
    super(props);

    this.mountRef = React.createRef();
    this.childRef;

    import(/* webpackIgnore: true */ '<remote.js>').then(
      ({ default: mountApp }) => {
        mountApp(this.mountRef.current, childRef => {
          this.childRef = childRef;
          this.childRef.setState(this.props);
        });
      }
    );
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.mountRef);
  }

  render() {
    if (this.childRef) {
      this.childRef.setState(this.props);
    }

    return <div ref={this.mountRef}></div>;
  }
}

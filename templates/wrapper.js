import React from 'react';
import ReactDOM from 'react-dom';

export default class Wrapper extends React.Component {
  constructor(props) {
    super(props);

    this.mountRef = React.createRef();
    this.childRef;

    import(/* webpackIgnore: true */ '<remote.js>').then(
      ({ default: mountApp }) => {
        this.shadow = this.mountRef.current.attachShadow({ mode: 'open' });

        mountApp(this.shadow, childRef => {
          this.childRef = childRef;
          this.childRef.setState(this.props);
        });
      }
    );
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.shadow);
  }

  render() {
    if (this.childRef) {
      this.childRef.setState(this.props);
    }

    return <div ref={this.mountRef}></div>;
  }
}

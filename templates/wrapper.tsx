import React from 'react';
import ReactDOM from 'react-dom';
import App from './child';

type ExtractProps<A> = A extends React.Component<infer P, any> ? P : never;

export default class Wrapper extends React.Component<ExtractProps<App>> {
  mountRef: React.RefObject<HTMLDivElement>;

  shadow: ShadowRoot;

  mountApp: any;

  constructor(props) {
    super(props);

    this.mountRef = React.createRef();

    // @ts-ignore
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

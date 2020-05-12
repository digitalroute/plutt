<template>
  <div ref="mountRef"></div>
</template>
<script>
const Proxy = {
  name: 'Proxy',
  props: {
    childProps: Object
  },
  mounted: function() {
    import(/* webpackIgnore: true */ process.env.HOST_PATH).then((mod) => {
      const {
        default: { mount: mountApp, unmount: unmountApp, update: updateApp }
      } = mod;

      this.mountElement = this.useShadow
        ? this.$refs.mountRef.attachShadow({ mode: 'open' })
        : this.$refs.mountRef;

      this.mountApp = mountApp;
      this.unmountApp = unmountApp;
      this.updateApp = updateApp;

      mountApp(this.mountElement, this.childProps);
    });
  },
  beforeDestroy: function() {
    if (this.mountElement) this.unmountApp(this.mountElement);
  },
  watch: {
    childProps() {
      if (this.updateApp) {
        this.updateApp(this.mountElement, this.childProps);
      }
    },
  },
};

export default Proxy;
</script>

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import VTooltip from 'v-tooltip';
import registryToast from './script/base/toast';
import VueMask from 'v-mask';
import vClickOutside from 'v-click-outside';

Vue.config.productionTip = false;
Vue.use(VTooltip, {
  defaultBoundariesElement: 'window',
});
Vue.use(registryToast);
Vue.use(VueMask);
Vue.use(vClickOutside);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

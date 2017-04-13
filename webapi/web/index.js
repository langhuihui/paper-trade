import Vue from 'vue'
import MuseUI from 'muse-ui'
import VueResource from 'vue-resource'
import 'muse-ui/dist/muse-ui.css'
Vue.use(MuseUI)
Vue.use(VueResource);
new Vue({ el: 'app', render: h => h(require('./view/app.vue')) })
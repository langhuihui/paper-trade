import Vue from 'vue'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
Vue.use(MuseUI)
new Vue({ el: 'app', render: h => h(require('./view/app.vue')) })
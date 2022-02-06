import Vue from 'vue'
import App from './App'
import uParse from '@/components/gaoyia-parse/parse.vue'  
import Clipboard from 'clipboard'
Vue.prototype.Clipboard = Clipboard
Vue.config.productionTip = false
Vue.component('u-parse',uParse)

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()

import { createApp } from 'vue'
import App from './App.vue'
import './styles/index.css' // 注入你的毛玻璃美学
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css'; // 引入 Ant Design 的基础样式
import { createPinia } from 'pinia'
import router from './router'

const app = createApp(App)
app.use(Antd).use(createPinia()).use(router)
app.mount('#app')
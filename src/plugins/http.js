import axios from 'axios'
const MyHttpServer = {}
MyHttpServer.install = (Vue) => {
  axios.defaults.baseURL = 'http://127.0.0.1:8888/api'
  Vue.prototype.$http = axios
}
export default MyHttpServer

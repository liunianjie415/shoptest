import axios from 'axios'
const MyHttpServer = {}
MyHttpServer.install = (Vue) => {
  Vue.prototype.$http = axios
}
export default MyHttpServer

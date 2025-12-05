import axios from 'axios';

axios.defaults.timeout = 300000 // 一旦、5分で設定
axios.defaults.baseURL = '/';

export default axios;
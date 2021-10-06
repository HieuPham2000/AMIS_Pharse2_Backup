/**
 * Thiết lập API tùy thuộc trạng thái development/ production
 */
var APIConfig = {
  development: 'https://localhost:44321',
  production: 'https://localhost:44321'
}

export default APIConfig[process.env.NODE_ENV];
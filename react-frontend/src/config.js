const config = {
  REACT_URL: process.env.REACT_APP_API_URL,
  PORT: process.env.REACT_APP_PORT,
  API_URL: process.env.REACT_APP_NODE_API_URL,
  API_PORT: process.env.REACT_APP_NODE_API_PORT,
};
console.log('REACT_APP_API_URL:', config.API_URL, config.API_PORT);

export default config;

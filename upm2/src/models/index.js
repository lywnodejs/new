const context = require.context('./', true, /\.js$/);
const modalFiles = context.keys().filter(item => item !== './index.js');

export default modalFiles.map((item) => {
  return context(item);
});

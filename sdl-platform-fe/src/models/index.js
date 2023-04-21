const context = require.context('./', true, /\.js$/);
const modelFiles = context.keys().filter(item => item !== './index.js' && item !== './user.js');

export default modelFiles.map((item) => {
  return context(item);
});

export const UAParser = require('ua-parser-js');
const isMobile = function() {
  const parser = new UAParser();
  const result = parser.getDevice();
  if (result.type === 'mobile' || result.type === 'tablet' || screen.width <= 800) {
    return true;
  }
  return false;
};
export default {
  isMobile
};
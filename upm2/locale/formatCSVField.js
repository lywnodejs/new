const json2csv = (field = '') => {
  return field.replace(/"/g, '""');
};

const csv2jsonWithKey = (field = '') => {
  return field.replace(/^"|"$/g, '');
};

const csv2jsonWithValue = (field = '') => {
  return csv2jsonWithKey(field.replace(/""/g, '"'));
};

module.exports = {
  json2csv,
  csv2jsonWithValue,
  csv2jsonWithKey
};

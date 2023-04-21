export default {
  'properties': {
    'data': {
      'type': 'object',
      'required': ['errno', 'errmsg'],
      'properties': {
        'errno': {
          'type': 'number'
        },
        'errmsg': {
          'type': 'string'
        },
        'data': {
          'type': ['object', 'array', 'string', 'null', 'boolean']
        }
      }
    }
  }
}

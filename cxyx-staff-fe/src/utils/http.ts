const SUCCESS_CODE = 0
export const httpParse = (response, successFn, failFn = (params) => {}) => {
  const {errno, data} = response
  if(errno === SUCCESS_CODE) return successFn(data)
  return failFn && failFn(response)
}
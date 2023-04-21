class LoginService {
  constructor (clientAxios) {
    this.http = clientAxios
  }

  login (params) {
    let url = '/user/signin'
    return this.http.postJson(url, params)
  }
}

export default {
  LoginService
}

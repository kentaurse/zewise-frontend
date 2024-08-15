import { jwtDecode } from 'jwt-decode'
import { createStorage } from 'prorage'

type JWTPayload = {
  uid: number
  username: string
  iat: number
  exp: number
}

class AuthInfo {
  private store: any

  constructor() {
    this.store = createStorage()

    // 检测是否有 token 若没有则跳转登录页
    if (!this.store.auth_token) {
      window.location.href = '/auth'
    }
  }

  get auth(): {
    token: string
    uid: number
    username: string
    exp: number
    iat: number
  } {
    return {
      token: this.store.auth_token,
      uid: this.store.auth_uid,
      username: this.store.auth_username,
      exp: this.store.auth_exp,
      iat: this.store.auth_iat
    }
  }

  set auth(newAuth: { token: string; uid: number; username: string; exp: number; iat: number }) {
    this.store.auth_token = newAuth.token
    this.store.auth_uid = newAuth.uid
    this.store.auth_username = newAuth.username
    this.store.auth_exp = newAuth.exp
    this.store.auth_iat = newAuth.iat
  }

  setToken(token: string) {
    this.auth = {
      ...this.auth,
      token
    }

    const decodedToken = jwtDecode<JWTPayload>(token)
    this.auth = {
      token: token,
      uid: decodedToken.uid,
      username: decodedToken.username,
      exp: decodedToken.exp,
      iat: decodedToken.iat
    }
  }

  // 清除 token
  clearToken() {
    this.auth = {
      token: '',
      uid: 0,
      username: '',
      exp: 0,
      iat: 0
    }
  }
}

export { AuthInfo, type JWTPayload }

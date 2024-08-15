import { AuthInfo } from '../stores/auth'

type UserProfile = {
  uid: number
  username: string
  nickname: string
  avatar_url: string
  birth: number | null
  gender: string | null
  level: number
}

const DefaultUserProfile: UserProfile = {
  uid: 0,
  username: '',
  nickname: '',
  avatar_url: '',
  birth: null,
  gender: null,
  level: 0
}

async function GetUserProfile(uid?: number): Promise<UserProfile> {
  if (uid === undefined) {
    const authInfo = new AuthInfo()
    uid = authInfo.auth.uid
  }

  // 访问api
  const resp = await fetch(`/api/user/profile?uid=${uid}`, {
    method: 'GET'
  })
  const data = (await resp.json()).data
  return data
}

export { DefaultUserProfile, GetUserProfile, type UserProfile }

import { AuthInfo } from '../stores/auth'

// PostDetail 文章详情
type PostDetail = {
  comment_id: number
  timestamp: number
  uid: number
  title: string
  content: string
  images: string[]
  like: number
  favourite: number
  forward: number
}

const DefaultPostDetail: PostDetail = {
  comment_id: 0,
  uid: 0,
  timestamp: 0,
  title: '',
  content: '',
  images: [],
  like: 0,
  favourite: 0,
  forward: 0
}

async function GetPostDetail(postID: number): Promise<PostDetail> {
  const resp = await fetch(`/api/post/${postID}`, {
    method: 'GET'
  })
  const data = (await resp.json()).data
  return data
}

export { DefaultPostDetail, GetPostDetail, type PostDetail }

// PostList 文章列表
type PostList = {
  ids: number[]
}

const DefaultPostList: PostList = {
  ids: []
}

async function GetPostList(params?: {
  type?: 'user' | 'liked' | 'favourited'
  uid?: number
  length?: number
  from?: number
}): Promise<PostList> {
  let url = `/api/post/list`
  if (params) {
    url += '?'
    if (params.type) {
      url += `type=${params.type}&`
    }
    if (params.uid) {
      url += `uid=${params.uid}&`
    }
    if (params.length) {
      url += `length=${params.length}&`
    }
    if (params.from) {
      url += `from=${params.from}&`
    }
  }
  const resp = await fetch(url, {
    method: 'GET'
  })
  const data = (await resp.json()).data
  return data
}

export { DefaultPostList, GetPostList, type PostList }

// PostUserStatus 用户文章状态
type PostUserStatus = {
  post_id: number
  uid: number
  like: boolean
  favourite: boolean
}

const DefaultPostUserStatus: PostUserStatus = {
  post_id: 0,
  uid: 0,
  like: false,
  favourite: false
}

// 获取博文用户状态
async function GetPostUserStatus(postID: number): Promise<PostUserStatus> {
  const authInfo = new AuthInfo()
  const resp = await fetch(`/api/post/user-status?post-id=${postID}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authInfo.auth.token}`
    }
  })
  const data = (await resp.json()).data
  return data
}

export { DefaultPostUserStatus, GetPostUserStatus, type PostUserStatus }

// LikePost 点赞文章
async function LikePost(postID: number): Promise<void> {
  const authInfo = new AuthInfo()
  const resp = await fetch(`/api/post/like?post-id=${postID}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authInfo.auth.token}`
    }
  })

  if (resp.status == 429) {
    throw new Error('操作过于频繁，请稍后再试')
  }

  const respJson = await resp.json()
  if (respJson.code !== 0) {
    if (respJson.message == 'user has liked this post') {
      throw new Error('你已经点赞过该文章了哦o(*￣▽￣*)ブ')
    }
    throw new Error('点赞文章失败: ' + respJson.message)
  }
}

// DislikePost 取消点赞文章
async function CancelLikePost(postID: number): Promise<void> {
  const authInfo = new AuthInfo()
  const resp = await fetch(`/api/post/cancel-like?post-id=${postID}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authInfo.auth.token}`
    }
  })

  if (resp.status == 429) {
    throw new Error('操作过于频繁，请稍后再试')
  }

  const respJson = await resp.json()
  if (respJson.code !== 0) {
    if (respJson.message == 'user has not liked this post') {
      throw new Error('你还没有点赞过该文章哦o(*￣▽￣*)ブ')
    }
    throw new Error('取消点赞失败: ' + respJson.message)
  }
}

export { LikePost, CancelLikePost }

// FavouritePost 收藏文章
async function FavouritePost(postID: number): Promise<void> {
  const authInfo = new AuthInfo()
  const resp = await fetch(`/api/post/favourite?post-id=${postID}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authInfo.auth.token}`
    }
  })
  const respJson = await resp.json()
  if (respJson.code !== 0) {
    if (respJson.message == 'user has favourite this post') {
      throw new Error('你已经收藏过该文章了哦o(*￣▽￣*)ブ')
    }
    throw new Error('收藏文章失败: ' + respJson.message)
  }
}

// CancelFavouritePost 取消收藏文章
async function CancelFavouritePost(postID: number): Promise<void> {
  const authInfo = new AuthInfo()
  const resp = await fetch(`/api/post/cancel-favourite?post-id=${postID}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authInfo.auth.token}`
    }
  })
  const respJson = await resp.json()
  if (respJson.code !== 0) {
    if (respJson.message == 'user has not favourite this post') {
      throw new Error('你还没有收藏过该文章哦o(*￣▽￣*)ブ')
    }
    throw new Error('取消收藏失败: ' + respJson.message)
  }
}

export { FavouritePost, CancelFavouritePost }

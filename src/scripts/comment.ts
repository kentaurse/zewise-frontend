import { AuthInfo } from '../stores/auth'

type CommentData = {
  comment_id: number
  post_id: number
  poster_uid: number
  content: string
  post_timestamp: number
  likes: number
  replies: number
}

const DefaultCommentData: CommentData = {
  comment_id: 0,
  post_id: 0,
  poster_uid: 0,
  content: '',
  post_timestamp: 0,
  likes: 0,
  replies: 0
}

// GetCommentDetail 获取评论
async function GetCommentDetail(commentID: number): Promise<CommentData> {
  const resp = await fetch(`/api/comment/detail?comment-id=${commentID}`)
  const respData = await resp.json()
  if (respData.code !== 0) {
    throw new Error(respData.message)
  }

  return respData.data
}

export { type CommentData, DefaultCommentData, GetCommentDetail }

// NewComment 发表评论
async function NewComment(postID: number, content: string): Promise<number> {
  const authInfo = new AuthInfo()
  const form = new FormData()
  form.append('post_id', postID.toString())
  form.append('content', content)

  const resp = await fetch('/api/comment/new', {
    method: 'POST',
    body: form,
    headers: {
      Authorization: `Bearer ${authInfo.auth.token}`
    }
  })

  const respData = await resp.json()
  if (respData.code !== 0) {
    throw new Error(respData.message)
  }

  return respData.data.id
}

export { NewComment }

// GetCommentList 获取评论列表
async function GetCommentList(postID: number): Promise<number[]> {
  const resp = await fetch(`/api/comment/list?post-id=${postID}`)
  const respData = await resp.json()
  if (respData.code !== 0) {
    throw new Error(respData.message)
  }

  if (respData.data.ids === null) {
    return []
  }

  return respData.data.ids
}

export { GetCommentList }

// CommentUserStatus 获取评论用户状态
type CommentUserStatus = {
  is_liked: boolean
  is_disliked: boolean
}

const DefaultCommentUserStatus: CommentUserStatus = {
  is_liked: false,
  is_disliked: false
}

// GetCommentUserStatus 获取评论用户状态
async function GetCommentUserStatus(commentID: number): Promise<CommentUserStatus> {
  const authInfo = new AuthInfo()
  const resp = await fetch(`/api/comment/user-status?comment-id=${commentID}`, {
    headers: {
      Authorization: `Bearer ${authInfo.auth.token}`
    }
  })

  const respData = await resp.json()
  if (respData.code !== 0) {
    throw new Error(respData.message)
  }

  return respData.data
}

export { type CommentUserStatus, DefaultCommentUserStatus, GetCommentUserStatus }

// LikeComment 点赞评论
async function LikeComment(commentID: number) {
  const authInfo = new AuthInfo()
  const resp = await fetch(`/api/comment/like?comment-id=${commentID}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authInfo.auth.token}`
    }
  })

  if (resp.status == 429) {
    throw new Error('操作过于频繁，请稍后再试')
  }

  const respData = await resp.json()
  if (respData.code !== 0) {
    if (respData.message == 'user has liked this comment') {
      throw new Error('你已经点赞过该评论哦o(*￣▽￣*)ブ')
    }
    throw new Error(respData.message)
  }
}

// CancelLikeComment 取消点赞评论
async function CancelLikeComment(commentID: number) {
  const authInfo = new AuthInfo()
  const resp = await fetch(`/api/comment/cancel-like?comment-id=${commentID}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authInfo.auth.token}`
    }
  })

  if (resp.status == 429) {
    throw new Error('操作过于频繁，请稍后再试')
  }

  const respData = await resp.json()
  if (respData.code !== 0) {
    if (respData.message == 'user has not liked this comment') {
      throw new Error('你还没有点赞过该评论哦o(*￣▽￣*)ブ')
    }
    throw new Error(respData.message)
  }
}

// DislikeComment 点踩评论
async function DislikeComment(commentID: number) {
  const authInfo = new AuthInfo()
  const resp = await fetch(`/api/comment/dislike?comment-id=${commentID}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authInfo.auth.token}`
    }
  })

  if (resp.status == 429) {
    throw new Error('操作过于频繁，请稍后再试')
  }

  const respData = await resp.json()
  if (respData.code !== 0) {
    if (respData.message == 'user has disliked this comment') {
      throw new Error('你已经点踩过该评论了哦o(*￣▽￣*)ブ')
    }
    throw new Error(respData.message)
  }
}

// CancelDislikeComment 取消点踩评论
async function CancelDislikeComment(commentID: number) {
  const authInfo = new AuthInfo()
  const resp = await fetch(`/api/comment/cancel-dislike?comment-id=${commentID}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authInfo.auth.token}`
    }
  })

  if (resp.status == 429) {
    throw new Error('操作过于频繁，请稍后再试')
  }

  const respData = await resp.json()
  if (respData.code !== 0) {
    if (respData.message == 'user has not disliked this comment') {
      throw new Error('你还没有点踩过该评论哦o(*￣▽￣*)ブ')
    }
    throw new Error(respData.message)
  }
}

export { LikeComment, CancelLikeComment, DislikeComment, CancelDislikeComment }

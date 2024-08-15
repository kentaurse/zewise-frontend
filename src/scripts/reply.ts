import { AuthInfo } from '../stores/auth'

// ReplyPost 回复文章
async function NewReply(commentID: number, content: string, parentReplyID?: number): Promise<void> {
  const auth = new AuthInfo()
  const resp = await fetch(`/api/reply/new`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth.auth.token}`
    },
    body: JSON.stringify({
      comment_id: commentID,
      parent_reply_id: parentReplyID,
      content: content
    })
  })

  const respJson = await resp.json()
  if (respJson.code !== 0) {
    throw new Error(respJson.message)
  }

  return
}

export { NewReply }

// ReplyList 回复列表
type ReplyList = {
  ids: number[]
}

// DefaultReplyList 默认回复列表
const DefaultReplyList: ReplyList = {
  ids: []
}

// GetReplyList 获取回复列表
async function GetReplyList(commentID: number): Promise<ReplyList> {
  const resp = await fetch(`/api/reply/list?comment-id=${commentID}`)
  const respJson = await resp.json()
  if (respJson.code !== 0) {
    throw new Error(respJson.message)
  }
  return respJson.data
}

export { DefaultReplyList, GetReplyList, type ReplyList }

// ReplyDetail 回复详情
type ReplyDetail = {
  id: number
  comment_id: number
  uid: number
  parent_reply_id: number
  parent_reply_uid: number
  content: string
  create_time: number
}

// DefaultReplyDetail 默认回复详情
const DefaultReplyDetail: ReplyDetail = {
  id: 0,
  comment_id: 0,
  uid: 0,
  parent_reply_id: 0,
  parent_reply_uid: 0,
  content: '',
  create_time: 0
}

// GetReplyDetail 获取回复详情
async function GetReplyDetail(replyID: number): Promise<ReplyDetail> {
  const resp = await fetch(`/api/reply/detail?reply-id=${replyID}`)
  const respJson = await resp.json()
  if (respJson.code !== 0) {
    throw new Error(respJson.message)
  }
  return respJson.data
}

export { DefaultReplyDetail, GetReplyDetail, type ReplyDetail }

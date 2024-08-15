type SearchPostList = {
  ids: number[]
}

const DefaultSearchPostList: SearchPostList = {
  ids: []
}

async function GetSearchPostList(queryString: string): Promise<SearchPostList> {
  const resp = await fetch(`/api/search/post?q=${queryString}`, {
    method: 'GET'
  })
  const data = (await resp.json()).data
  return data
}

export { DefaultSearchPostList, GetSearchPostList, type SearchPostList }

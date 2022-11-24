import React from "react"
import useSWR from "swr"
import { request } from "undici"
import { Text } from "ink"
import { marked } from "marked"
import TerminalRenderer from "marked-terminal"

const fetcher = (url: string) => request(`https://www.tabnews.com.br/api/v1${url}`)
  .then(res => res.body.json())
  .then(data => data)

interface Props {
  url: string
}

marked.setOptions({
  renderer: new TerminalRenderer()
})

const Post: React.FC<Props> = ({ url }) => {
  const { data } = useSWR(`/contents${url}`, fetcher)

	return (
    <>
      {data ? (
        <Text>{marked(data.body)}</Text>
      ) : <Text>Loading...</Text>}
    </>
  )
}

export default Post

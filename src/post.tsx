import React from "react"
import useSWR from "swr"
import { request } from "undici"
import { Text } from "ink"
import { marked } from "marked"
import TerminalRenderer from "marked-terminal"
import { Box } from "ink"
import Link from "ink-link"
import { formatDistance } from "date-fns"
import pt from "date-fns/locale/pt-BR"

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
  const { data: post } = useSWR(`/contents${url}`, fetcher)
  const { data: comments } = useSWR(`/contents${url}/children`, fetcher)

	return (
    <>
      {post ? (
        <Box flexDirection="column">
          {/* @ts-ignore */}
          <Link url={`https://tabnews.com.br${url}`}>
            <Text bold={true}>{post.title}</Text>
          </Link>
          <Box borderStyle="round" padding={1}>
            <Text>{marked(post.body)}</Text>
          </Box>
          {comments ? (
            comments.map(comment => (
              <Box key={comment.id} borderStyle="round" padding={1}>
                <Text>{marked(comment.body)}</Text>
                <Box marginTop={1}>
                  <Text bold={true}>{comment.owner_username}</Text>
                  <Box marginLeft={1}>
                    <Text>{comment.tabcoins} tabcoins</Text>
                    <Box marginLeft={1}>
                      <Text>{formatDistance(new Date(comment.created_at), Date.now(), { locale: pt, addSuffix: true })}</Text>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))
          ) : <Text>Loading comments...</Text>}
        </Box>
      ) : <Text>Loading...</Text>}
    </>
  )
}

export default Post

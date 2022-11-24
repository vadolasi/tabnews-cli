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

marked.setOptions({
  renderer: new TerminalRenderer()
})

function parserMarkdown(text: string) {
  return marked(text)
}

const fetcher = (url: string) => request(`https://www.tabnews.com.br/api/v1${url}`)
  .then(res => res.body.json())
  .then(data => data)

interface Props {
  url: string
}


const Comment: React.FC<{ comment: any, responses: any, deep: number }> = ({ comment, responses, deep }) => {
  return (
    <>
      <Box flexDirection="column" marginLeft={deep * 3} borderStyle="round" padding={1}>
        <Box>
          {/* @ts-ignore */}
          <Text bold={true}>{comment.owner_username}</Text>
          <Text> - </Text>
          <Text color="blue">{comment.tabcoins} tabcoins</Text>
          <Text> - </Text>
          <Text dimColor={true}>{formatDistance(new Date(comment.created_at), new Date(), { locale: pt, addSuffix: true, includeSeconds: true })} atrás</Text>
        </Box>
        <Box>
          <Text>{parserMarkdown(comment.body)}</Text>
        </Box>
      </Box>
      {responses.map((response: any) => (
        <Comment key={response.id} comment={response} responses={response.children} deep={deep + 1} />
      ))}
    </>
  )
}

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
          <Text color="blueBright">{post.tabcoins} tabcoins</Text>
          <Text dimColor={true}>{formatDistance(new Date(post.created_at), new Date(), { locale: pt, addSuffix: true, includeSeconds: true })} atrás</Text>
          <Box borderStyle="double" padding={1}>
            <Text>{parserMarkdown(post.body)}</Text>
          </Box>
          {comments ? (
            <>
              <Text>Comentários</Text>
              {(comments as any[]).map(comment => (
                <Comment key={comment.id} comment={comment} responses={comment.children} deep={0} />
              ))}
            </>
          ) : <Text>Loading comments...</Text>}
        </Box>
      ) : <Text>Loading...</Text>}
    </>
  )
}

export default Post

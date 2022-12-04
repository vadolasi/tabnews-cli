import React from "react"
import useSWR from "swr"
import { Text, useInput } from "ink"
import { marked } from "marked"
import TerminalRenderer from "marked-terminal"
import { Box } from "ink"
import Link from "ink-link"
import { formatDistance } from "date-fns"
import pt from "date-fns/locale/pt-BR"
import Spinner from "ink-spinner"
import Comment from "./comment"
import axios from "axios"

marked.setOptions({
  renderer: new TerminalRenderer()
})

function parserMarkdown(text: string) {
  return marked(text)
}

const fetcher = (url: string) => axios.get(url).then(res => res.data)

interface Props {
  url: string
  pushRoute: (route: string) => void
}

const Post: React.FC<Props> = ({ url, pushRoute }) => {
  const { data: post } = useSWR(`/contents${url}`, fetcher)
  const { data: comments } = useSWR(`/contents${url}/children`, fetcher)

  useInput((_input, key) => {
    if (key.escape || key.backspace) {
      pushRoute("posts")
    }
  })

	return (
    <>
      {post ? (
        <Box flexDirection="column">
          {/* @ts-ignore */}
          <Link url={`https://www.tabnews.com.br${url}`}>
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
          ) : (
            <Box marginTop={1}>
              <Text>
                <Text color="green">
                <Spinner type="dots" />
                </Text>
                {" "}Carregando posts
              </Text>
            </Box>
          )}
        </Box>
      ) : (
        <Box marginTop={1}>
          <Text>
            <Text color="green">
            <Spinner type="dots" />
          </Text>
          {" "}Carregando posts
          </Text>
        </Box>
      )}
    </>
  )
}

export default Post

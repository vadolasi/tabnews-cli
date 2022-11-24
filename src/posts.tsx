import React from "react"
import { Text, Box, useInput } from "ink"
import useSWR from "swr"
import { request } from "undici"
import Link from "ink-link"
import { formatDistance } from "date-fns"
import pt from "date-fns/locale/pt-BR"

const fetcher = (url: string) => request(`https://www.tabnews.com.br/api/v1${url}`)
  .then(res => res.body.json())
  .then(data => data)

interface Props {
  page: number
  perPage: number
  strategy: "new" | "old" | "relevant"
  selected: number
  onPostSelect: (url: string) => void
}

const Posts: React.FC<Props> = ({ page, perPage, strategy, selected, onPostSelect }) => {
  const { data } = useSWR(`/contents?page=${page}&per_page=${perPage}&strategy=${strategy}`, fetcher)

  useInput((_input, key) => {
    if (key.return) {
      if (data) {
        const post = data[selected]
        if (post) {
          onPostSelect(`/${post.owner_username}/${post.slug}`)
        }
      }
    }
  })

	return (
    <>
      {data ? (
        (data as any[]).map((post, i) => (
          <Box key={post.id} marginTop={1}>
            <Text backgroundColor={selected === i ? "blue" : undefined} color={selected === i ? "white" : undefined}>
              {/* @ts-ignore */}
              <Link url={`https://tabnews.com.br/${post.owner_username}/${post.slug}`}>
                <Text bold={true}>{post.title}</Text>
                <Text> - </Text>
                <Text color="blue">{post.tabcoins} tabcoins</Text>
                <Text> - </Text>
                <Text dimColor={true}>{formatDistance(new Date(post.created_at), new Date(), { locale: pt, addSuffix: true, includeSeconds: true })} atrás</Text>
              </Link>
            </Text>
          </Box>
        ))
      ) : <Text>Loading...</Text>}
    </>
  )
}

export default Posts

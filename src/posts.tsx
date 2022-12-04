import React from "react"
import { Text, Box, useInput } from "ink"
import useSWR from "swr"
import Link from "ink-link"
import { formatDistance } from "date-fns"
import pt from "date-fns/locale/pt-BR"
import Spinner from "ink-spinner"
import { useState } from "react"
import axios from "axios"

const fetcher = (url: string) => axios.get(url).then(res => res.data)
interface Props {
  setUrl: (url: string) => void
  pushRoute: (route: string) => void
}

const Posts: React.FC<Props> = ({ setUrl, pushRoute }) => {
  const [page, setPage] = useState(1)
  const perPage = 20
  const [selected, setSelected] = React.useState(0)

  const strategies = { relevant: "Relevantes", new: "Recentes", old: "Antigos" }
  const [strategyIndex, setStrategyIndex] = useState(0)

  const { data } = useSWR(`/contents?page=${page}&per_page=${perPage}&strategy=${Object.keys(strategies)[strategyIndex]}`, fetcher)

  const [post, setPost] = useState<string | null>(null)

  useInput((_input, key) => {
    if (key.return) {
      if (data) {
        const post = data[selected]
        if (post) {
          setUrl(`/${post.owner_username}/${post.slug}`)
          pushRoute("post")
        }
      }
    }
  })

  useInput((input, key) => {
    if (key.escape || key.backspace) {
      setPost(null)
    } else if (key.tab && !post) {
      if (strategyIndex < Object.entries(strategies).length - 1) {
        setStrategyIndex(strategyIndex + 1)
      } else {
        setStrategyIndex(0)
      }
    } else if (key.upArrow && !post) {
      if (selected > 0) {
        setSelected(selected - 1)
      } else {
        setSelected(perPage - 1)
      }
    } else if (key.downArrow && !post) {
      if (selected < perPage - 1) {
        setSelected(selected + 1)
      } else {
        setSelected(0)
      }
    } else if (key.leftArrow && !post) {
      if (page > 1) {
        setPage(page - 1)
      }
    } else if (key.rightArrow && !post) {
      setPage(page + 1)
    }
  })

	return (
    <>
      <Box>
        {Object.entries(strategies).map(([name, label], i) => (
          <Text key={name} bold={strategyIndex == i} color={strategyIndex == i ? "yellow" : undefined}>
            {label}{" "}
          </Text>
        ))}
      </Box>
      {data ? (
        (data as any[]).map((post, i) => (
          <Box key={post.id} marginTop={1}>
            <Text color={selected === i ? "blue" : undefined}>
              {/* @ts-ignore */}
              <Link url={`https://www.tabnews.com.br/${post.owner_username}/${post.slug}`}>
                <Text bold={true}>{post.title}</Text>
                <Text> - </Text>
                <Text color="blue">{post.tabcoins} tabcoins</Text>
                <Text> - </Text>
                <Text dimColor={true}>{formatDistance(new Date(post.created_at), new Date(), { locale: pt, addSuffix: true, includeSeconds: true })} atrás</Text>
                <Text> - </Text>
                <Text dimColor={true}>{post.children_deep_count} comentários</Text>
              </Link>
                <Text> - </Text>
                {/* @ts-ignore */}
                <Link url={`https://www.tabnews.com.br/${post.owner_username}`}>
                  <Text backgroundColor="cyan">{post.owner_username}</Text>
                </Link>
            </Text>
          </Box>
        ))
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

export default Posts

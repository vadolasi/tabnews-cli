import React from "react"
import { Text, Box, useInput } from "ink"
import useSWR from "swr"
import { formatDistance } from "date-fns"
import pt from "date-fns/locale/pt-BR"
import Spinner from "ink-spinner"
import { useState } from "react"
import { request } from "undici"

const fetcher = (url: string) => request(`https://www.tabnews.com.br/api/v1${url}`)
  .then(res => res.body.json())
  .then(data => data)

interface Props {
  setUrl: (url: string) => void
  pushRoute: (route: string) => void
}

const Posts: React.FC<Props> = ({ setUrl, pushRoute }) => {
  const [page, setPage] = useState(1)
  const perPage = 10

  const strategies = { relevant: "Relevantes", new: "Recentes", old: "Antigos" }
  const [strategyIndex, setStrategyIndex] = useState(0)

  const { data } = useSWR(`/contents?page=${page}&per_page=${perPage}&strategy=${Object.keys(strategies)[strategyIndex]}`, fetcher)
  useSWR(`/contents?page=${page + 1}&per_page=${perPage}&strategy=${Object.keys(strategies)[strategyIndex]}`, fetcher)

  useInput((input, key) => {
    // verify if the input is number between 0 and 9
    if (input >= "0" && input <= "9") {
      const post = data[parseInt(input)]

      setUrl(`/${post.owner_username}/${post.slug}`)
      pushRoute("post")
    }
  })

  useInput((input, key) => {
    if (key.tab) {
      if (strategyIndex < Object.entries(strategies).length - 1) {
        setStrategyIndex(strategyIndex + 1)
      } else {
        setStrategyIndex(0)
      }
    } else if (key.leftArrow) {
      if (page > 1) {
        setPage(page - 1)
      }
    } else if (key.rightArrow) {
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
            <Text>
              {/* @ts-ignore */}
                <Text bold={true} color="green">{i}</Text>
                <Text> - </Text>
                <Text bold={true}>{post.title}</Text>
                <Text> - </Text>
                <Text color="blue">{post.tabcoins} tabcoins</Text>
                <Text> - </Text>
                <Text dimColor={true}>{formatDistance(new Date(post.created_at), new Date(), { locale: pt, addSuffix: true, includeSeconds: true })} atrás</Text>
                <Text> - </Text>
                <Text dimColor={true}>{post.children_deep_count} comentários</Text>
                <Text> - </Text>
                {/* @ts-ignore */}
                <Text backgroundColor="cyan">{post.owner_username}</Text>
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

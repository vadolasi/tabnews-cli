import React from "react"
import { render, Text } from "ink"
import Posts from "./posts"
import { useInput } from "ink"
import { useState } from "react"
import { Box } from "ink"
import Post from "./post"

const TabNews = () => {
  const [page, setPage] = useState(1)
  const perPage = 20
  const [selected, setSelected] = React.useState(0)

  const strategies = { "relevant": "Relevantes", "new": "Recentes", "old": "Antigos" }
  const [strategyIndex, setStrategyIndex] = useState(0)

  const [post, setPost] = useState<string | null>(null)

  useInput((_input, key) => {
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
      {post ? (
        <Post url={post} />
      ) : (
        <>
          <Box>
            {Object.entries(strategies).map(([name, label], i) => (
              <Text key={name} bold={strategyIndex == i} color={strategyIndex == i ? "yellow" : undefined}>
                {label}{" "}
              </Text>
            ))}
          </Box>
          <Posts page={page} perPage={perPage} strategy={Object.keys(strategies)[strategyIndex]} selected={selected} onPostSelect={url => setPost(url)} />
        </>
      )}
    </>
  )
}

render(<TabNews />)

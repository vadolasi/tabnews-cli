import React from "react"
import { render, Text } from "ink"
import Posts from "./posts"
import { useInput } from "ink"
import { Newline } from "ink"
import { useState } from "react"
import { Box } from "ink"

const TabNews = () => {
  const [page, setPage] = useState(1)
  const perPage = 10
  const [selected, setSelected] = React.useState(0)

  const strategies: ["new", "old", "relevant"] = ["new", "old", "relevant"]
  const [strategyIndex, setStrategyIndex] = useState(0)

  useInput((_input, key) => {
    if (key.tab) {
      if (strategyIndex < strategies.length - 1) {
        setStrategyIndex(strategyIndex + 1)
      } else {
        setStrategyIndex(0)
      }
    } else if (key.upArrow) {
      if (selected > 0) {
        setSelected(selected - 1)
      }
    } else if (key.downArrow) {
      if (selected < perPage - 1) {
        setSelected(selected + 1)
      } else {
        setSelected(0)
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
      <Box display="flex" flexDirection="column">
        <Text bold={true}>Página: {page}</Text>
        {strategies.map((strategy, i) => (
          <Text key={strategy} bold={strategyIndex == i}>
            {strategy}
          </Text>
        ))}
      </Box>
      <Newline />
      <Posts page={page} perPage={perPage} strategy={strategies[strategyIndex]} selected={selected} />
    </>
  )
}

render(<TabNews />)

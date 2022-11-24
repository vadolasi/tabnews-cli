import React from "react"
import { render, Text } from "ink"
import Posts from "./posts"
import { useInput } from "ink"
import { Newline } from "ink"
import { useState } from "react"

const TabNews = () => {
  const [page, setPage] = useState(1)
  const perPage = 10
  const strategy = "new"
  const [selected, setSelected] = React.useState(0)

  useInput((_input, key) => {
    if (key.upArrow) {
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
      <Text bold={true}>Página: {page}</Text>
      <Newline />
      <Posts page={page} perPage={perPage} strategy={strategy} selected={selected} />
    </>
  )
}

render(<TabNews />)

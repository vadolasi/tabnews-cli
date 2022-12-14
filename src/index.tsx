import React, { useCallback } from "react"
import { Box, render, useInput, Text } from "ink"
import Posts from "./pages/posts"
import { useState } from "react"
import Post from "./pages/post"
import Login from "./pages/login"
import Profile from "./components/Profile"
import TextInput from "ink-text-input"
import Publish from "./pages/publish"

const TabNews = () => {
  const [url, setUrl] = useState("")
  const [route, setRoute] = useState("posts")
  const [query, setQuery] = useState("")
  const [typing, setTyping] = useState(false)

  const pushRoute = (route: string) => {
    setRoute(route)
  }

  useInput((input, key) => {
    if (typing) {
      if (key.return) {
        setTyping(false)

        switch (query) {
          case "login":
            pushRoute("login")
            break
          case "publicar":
            pushRoute("publicar")
            break
        }
      } else if (key.escape) {
        setTyping(false)
      }
    } else if (input === "q") {
      setTyping(true)
    }
  })

  const renderContent = useCallback(() => {
    switch (route) {
      case "posts":
        return <Posts setUrl={setUrl} pushRoute={pushRoute} />
      case "post":
        return <Post url={url} pushRoute={pushRoute} />
      case "login":
        return <Login pushRoute={pushRoute} />
      case "publicar":
        return <Publish pushRoute={pushRoute} />
    }
  }, [route])

  return (
    <>
      <Profile />
      {renderContent()}
      {typing && (
        <Box marginTop={2}>
          <Text>{"> "}</Text>
          <TextInput value={query} onChange={setQuery} focus={true} />
        </Box>
      )}
    </>
  )
}

render(<TabNews />)

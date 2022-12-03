import React, { useEffect, useState } from "react"
import { Box, Text } from "ink"
import Spinner from "ink-spinner"
import Link from "ink-link"
import { readFile } from "fs/promises"
import useSWR from "swr"
import { request } from "undici"

const fetcher = (url: string) => request(`https://www.tabnews.com.br/api/v1${url}`)
  .then(res => res.body.json())
  .then(data => data)

export default function Profile() {
  const [loadingUser, setLoadingUser] = useState(true)
  const [token, setToken] = useState<any>(null)

  const { data: userData } = useSWR(
    token ? "/user" : null,
    (url: string) =>
      request(
        `https://www.tabnews.com.br/api/v1${url}`,
        {
          headers: {
            "cookie": `session_id=${token}`
          }
        }
      )
        .then(res => res.body.json())
        .then(data => data)
  )

  useEffect(() => {
    readFile("session.json")
      .then(async data => {
        const dataJSON = JSON.parse(data.toString())
        setToken(dataJSON.token)
        setLoadingUser(false)
      })
      .catch(() => setLoadingUser(false))
  }, [])

  return (
    <Box alignSelf="flex-end">
      {loadingUser ? (
        <Box marginTop={1}>
          <Text>
            <Text color="green">
            <Spinner type="dots" />
          </Text>
          {" "}Carregando usuário logado
          </Text>
        </Box>
      ) : userData && (
        <>
          {/* @ts-ignore */}
          <Link url={`https://www.tabnews.com.br/${userData.username}`}>
            <Text>{userData.username}{"  "}</Text>
          </Link>
          <Text color="blue">{userData.tabcoins} tabcoins{"  "}</Text>
          <Text color="green">{userData.tabcash} tabcash</Text>
        </>
        )
      }
    </Box>
  )
}

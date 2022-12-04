import React from "react"
import { useState } from "react"
import TextInput from "ink-text-input"
import { Box, useInput, Text } from "ink"
import Spinner from "ink-spinner"
import { writeFile } from "fs/promises"
import axios from "axios"

const Login = ({ pushRoute }: { pushRoute: Function }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [focus, setFocus] = useState<"email" | "password">("email")
  const [loading, setLoading] = useState(false)

  useInput(async (_input, key) => {
    if (key.upArrow || key.downArrow) {
      if (focus == "email") {
        setFocus("password")
      } else {
        setFocus("email")
      }
    } else if (key.return) {
      setLoading(true)

      const response = await axios.post(
        "https://www.tabnews.com.br/api/v1/sessions",
        { email, password },
        {
          method: "POST",
          headers: {
            "content-type": "application/json"
          }
        }
      )

      const data = await response.data

      await writeFile("session.json", data)

      pushRoute("posts")
    }
  })

  return (
    <>
      {loading ? (
        <Box marginTop={1}>
          <Text>
            <Text color="green">
            <Spinner type="dots" />
            </Text>
            {" "}Processando requisição
          </Text>
        </Box>
      ) :
        <Box display="flex" flexDirection="column" borderStyle="round" alignSelf="center" minWidth={30}>
          <Text>Email</Text>
          <TextInput value={email} onChange={setEmail} focus={focus == "email"} />
          <Text>Senha</Text>
          <TextInput value={password} onChange={setPassword} focus={focus == "password"} mask="*" />
        </Box>
      }
    </>
  )
}

export default Login

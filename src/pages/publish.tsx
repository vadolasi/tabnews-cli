import React, { useReducer, useState } from "react"
import { Box, Text, useInput } from "ink"
import TextInput from "ink-text-input"
import { marked } from "marked"
import TerminalRenderer from "marked-terminal"
import { readFile, writeFile } from "fs/promises"
import Spinner from "ink-spinner"
import { request } from "undici"

const fetcher = (url: string) => request(`https://www.tabnews.com.br/api/v1${url}`)
  .then(res => res.body.json())
  .then(data => data)

marked.setOptions({
  renderer: new TerminalRenderer()
})

function parserMarkdown(text: string) {
  return marked(text)
}

export default function Publish({ pushRoute }: { pushRoute: Function }) {
  const [text, setText] = useState<string[]>(["", ""])
  const [currentLine, setCurrentLine] = useState(0)
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  const [tab, setTab] = useState<"edit" | "preview">("edit")
  const [loading, setLoading] = useState(false)

  const lineUpdater = (line: number) => {
    return (value: string) => {
      setText(draft => {
        draft[line] = value

        return draft
      })
      forceUpdate()
    }
  }

  useInput(async (_input, key) => {
    if (key.return) {
      setLoading(true)
      const file = await readFile("session.json")
      const data = JSON.parse(file.toString())

      const response = await request(
        `https://www.tabnews.com.br/api/v1/contents`,
        {
          body: JSON.stringify({
            title: text[0],
            body: text.splice(1, text.length).join("\n"),
            status: "published"
          }),
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            cookie: `session_id=${data.token}`
          }
        }
      )

      await writeFile("response.json", await response.body.text())
      pushRoute("posts")
    } else if (key.downArrow) {
      if (currentLine < text.length - 1) {
        setText(draft => {
          draft.push("")

          return draft
        })
      }
      setCurrentLine(currentLine + 1)
    } else if (key.upArrow) {
      if (currentLine > 0) {
        setCurrentLine(currentLine - 1)

        if (text[currentLine] === "") {
          setText(draft => {
            draft.pop()

            return draft
          })
        }
      }
    } else if (key.tab) {
      setTab(tab => (tab === "edit" ? "preview" : "edit"))
    }
  })

  return (
    <>
      {!loading ? (
        <>
          <Box>
            <Text bold={tab == "edit"} color={tab == "edit" ? "yellow" : undefined}>Editar </Text>
            <Text bold={tab == "preview"} color={tab == "preview" ? "yellow" : undefined}>Pré-visualizar</Text>
          </Box>
          {tab === "edit" ? (
            <>
              <Box flexDirection="column" marginBottom={1} marginTop={2}>
                <Box>
                  <Text bold={true}>Título</Text>
                </Box>
                <Box>
                  {currentLine == 0 ? <TextInput value={text[0]} onChange={lineUpdater(0)} /> : <Text>{text[0]}</Text>}
                </Box>
              </Box>
              <Box>
                <Text bold={true}>Conteúdo</Text>
              </Box>
              {text.slice(1, text.length).map((line, index) => currentLine === index + 1 ? (
                <TextInput value={line} key={index} onChange={lineUpdater(index + 1)} focus={true} />
              ) : (
                <Text key={index}>{line}</Text>
              ))}
            </>
          ): (
            <>
              <Box flexDirection="column" marginBottom={1} marginTop={2}>
                <Box>
                  <Text bold={true}>Título</Text>
                </Box>
                <Box>
                  <Text>{text[0]}</Text>
                </Box>
              </Box>
              <Box borderStyle="double" padding={1}>
                <Text>{parserMarkdown(text.slice(1, text.length).join("\n"))}</Text>
              </Box>
            </>
          )}
        </>
      ): (
        <Box marginTop={1}>
          <Text>
            <Text color="green">
            <Spinner type="dots" />
          </Text>
          {" "}Publicnado conteúdo...
          </Text>
        </Box>
      )}
    </>
  )
}

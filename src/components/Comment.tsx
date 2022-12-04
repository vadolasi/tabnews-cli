import React from "react"
import { Box, Text } from "ink"
import { formatDistance } from "date-fns"
import pt from "date-fns/locale/pt-BR"
import { marked } from "marked"
import TerminalRenderer from "marked-terminal"

marked.setOptions({
  renderer: new TerminalRenderer()
})

function parserMarkdown(text: string) {
  return marked(text)
}

const Comment: React.FC<{ comment: any, responses: any, deep: number }> = ({ comment, responses, deep }) => {
  return (
    <>
      <Box flexDirection="column" marginLeft={deep * 3} borderStyle="round" padding={1}>
        <Box>
          {/* @ts-ignore */}
          <Text bold={true}>{comment.owner_username}</Text>
          <Text> - </Text>
          <Text color="blue">{comment.tabcoins} tabcoins</Text>
          <Text> - </Text>
          <Text dimColor={true}>{formatDistance(new Date(comment.created_at), new Date(), { locale: pt, addSuffix: true, includeSeconds: true })} atrás</Text>
        </Box>
        <Box>
          <Text>{parserMarkdown(comment.body)}</Text>
        </Box>
      </Box>
      {responses.map((response: any) => (
        <Comment key={response.id} comment={response} responses={response.children} deep={deep + 1} />
      ))}
    </>
  )
}

export default Comment

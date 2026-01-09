"use client"

import { useRouter } from "next/navigation"
import Button, { ButtonType } from "./components/form/Button"
import MessageBlock from "./components/messages/MessageBlock"
import { PATHS } from "./lib/paths"

export default function Home() {
  const router = useRouter()

  const startNewTournament = () => {
    router.push(PATHS.CREATE_PAGE)
  }

  return (
    <MessageBlock title="Start your competition. Build your tournament structure and play through every match of the bracket stage.">
      <Button
        variant={ButtonType.Primary}
        onClick={startNewTournament}
        additionalClassNames="w-full sm:w-auto"
      >
        Start new tournament
      </Button>
    </MessageBlock>
  )
}

"use client"

import { useRouter } from "next/navigation"
import Button, { ButtonType } from "./components/form/Button"
import MessageBlock, {
  MessageBlockSize,
} from "./components/messages/MessageBlock"
import { PATHS } from "./lib/paths"
import ImportTournamentDataButton from "./components/form/ImportTournamentDataButton"

export default function Home() {
  const router = useRouter()

  const startNewTournament = () => {
    router.push(PATHS.CREATE_PAGE)
  }

  return (
    <div className="flex justify-center">
      <MessageBlock
        title="Start your competition. Build your tournament structure or import it via JSON, then play through every match in the bracket stage."
        size={MessageBlockSize.Large}
      >
        <div className="flex justify-between">
          <Button
            variant={ButtonType.Primary}
            onClick={startNewTournament}
            additionalClassNames="w-full sm:w-auto"
          >
            Start new tournament
          </Button>
          <ImportTournamentDataButton />
        </div>
      </MessageBlock>
    </div>
  )
}

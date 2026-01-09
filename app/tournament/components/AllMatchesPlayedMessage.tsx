"use client"

import Button, { ButtonType } from "@/app/components/form/Button"
import MessageBlock from "@/app/components/messages/MessageBlock"
import { useTournament } from "@/app/context/TournamentContext"
import { PATHS } from "@/app/lib/paths"
import { useRouter } from "next/navigation"

const AllMatchesPlayedMessage = () => {
  const { tournamentData, setTournamentData } = useTournament()

  const router = useRouter()

  const startNewTournament = () => {
    setTournamentData(null)

    router.push(PATHS.CREATE_PAGE)
  }

  if (!tournamentData) {
    console.error("Tournament data does not exist")
    return null
  }

  return (
    <MessageBlock
      title={
        <>
          All &quot;{tournamentData?.title}&quot; matches have been played. You
          can look at the result in &quot;Bracket&quot; section, or clear
          current tournament data and start new one
        </>
      }
    >
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

export default AllMatchesPlayedMessage

"use client"
import Button, { ButtonType } from "@/app/components/form/Button"
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
    <div className="border-2 border-[#2D2D2D] rounded-sm w-full max-w-[400px] p-4">
      <h2 className="text-gray-300 text-lg mb-2 text-justify justify-self-center">
        All &quot;{tournamentData?.title}&quot; matches have been played. You
        can look at the result in &quot;Bracket&quot; section, or clear current
        tournament data and start new one
      </h2>
      <Button variant={ButtonType.Primary} onClick={startNewTournament}>
        Start new tournament
      </Button>
    </div>
  )
}

export default AllMatchesPlayedMessage

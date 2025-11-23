import { useMemo, useState } from "react"
import Button, { ButtonType } from "../form/Button"
import { EMatchFormat } from "@/app/lib/tournamentOptions"
import { IMatch } from "@/app/types/tournament"

interface IMatchView {
  firstTeam: string
  secondTeam: string
  format: EMatchFormat
  result: IMatch["result"]
  setScore: (winningTeam: 1 | 2) => void
  resetScore: () => void
  confirmResult: () => void
}

const MatchView = ({
  firstTeam,
  secondTeam,
  format,
  result,
  setScore,
  resetScore,
  confirmResult,
}: IMatchView) => {
  const [isActionMade, setIsActionMade] = useState<boolean>(!!result)

  const isAllowedChangingScore = useMemo(() => {
    if (!result) return true

    if (format === EMatchFormat.SingleMatch) return true

    if (format === EMatchFormat.BO3) {
      return !(result.team1Score === 2 || result.team2Score === 2)
    }

    if (format === EMatchFormat.BO5) {
      return !(result.team1Score === 3 || result.team2Score === 3)
    }
  }, [result, format])

  const isAllowedToProceed = useMemo(() => {
    if (!result) return false

    if (format === EMatchFormat.SingleMatch) {
      // Cannot be draw
      return result.team1Score !== result.team2Score
    }

    if (format === EMatchFormat.BO3) {
      return result.team1Score === 2 || result.team2Score === 2
    }

    if (format === EMatchFormat.BO5) {
      return result.team1Score === 3 || result.team2Score === 3
    }
  }, [result, format])

  const handleScore = (winningTeam: 1 | 2) => {
    setScore(winningTeam)

    setIsActionMade(true)
  }

  const hanleResetScore = () => {
    resetScore()
    setIsActionMade(false)
  }

  const teamNameClassnames = "text-gray-300 text-6xl"
  return (
    <div>
      <div className="flex justify-between">
        <div>
          <h2 className={teamNameClassnames}>{firstTeam}</h2>
          <Button
            onClick={() => {
              handleScore(1)
            }}
            variant={
              isAllowedChangingScore ? ButtonType.Primary : ButtonType.Disabled
            }
          >
            {firstTeam} Wins
          </Button>
        </div>
        <div className={teamNameClassnames}>
          {result?.team1Score ?? 0} - {result?.team2Score ?? 0}
        </div>
        <div>
          <h2 className={teamNameClassnames}>{secondTeam}</h2>
          <Button
            onClick={() => {
              handleScore(2)
            }}
            variant={
              isAllowedChangingScore ? ButtonType.Primary : ButtonType.Disabled
            }
          >
            {secondTeam} Wins
          </Button>
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <Button
          onClick={confirmResult}
          variant={
            isAllowedToProceed ? ButtonType.Primary : ButtonType.Disabled
          }
        >
          Confirm result
        </Button>
        <Button
          onClick={hanleResetScore}
          variant={isActionMade ? ButtonType.Secondary : ButtonType.Disabled}
        >
          Reset result
        </Button>
      </div>
    </div>
  )
}

export default MatchView

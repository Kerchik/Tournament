import { useMemo, useState } from "react"
import Button, { ButtonType } from "../form/Button"
import { EMatchFormat } from "@/app/lib/tournamentOptions"
import { IMatch } from "@/app/types/tournament"

const BO3_WINNING_SCORE = 2
const BO5_WINNING_SCORE = 3

interface IMatchView {
  firstTeam: string
  secondTeam: string
  format: EMatchFormat
  result: IMatch["result"]
  setScore: (winningTeam: 1 | 2) => void
  resetScore: () => void
  confirmResult: () => void
  tournamentTitle: string
}

const MatchView = ({
  firstTeam,
  secondTeam,
  format,
  result,
  setScore,
  resetScore,
  confirmResult,
  tournamentTitle,
}: IMatchView) => {
  const [isActionMade, setIsActionMade] = useState<boolean>(!!result)

  const isAllowedChangingScore = useMemo(() => {
    if (!result) return true

    if (format === EMatchFormat.SingleMatch) return true

    if (format === EMatchFormat.BO3) {
      return !(
        result.team1Score === BO3_WINNING_SCORE ||
        result.team2Score === BO3_WINNING_SCORE
      )
    }

    if (format === EMatchFormat.BO5) {
      return !(
        result.team1Score === BO5_WINNING_SCORE ||
        result.team2Score === BO5_WINNING_SCORE
      )
    }
  }, [result, format])

  const isAllowedToProceed = useMemo(() => {
    if (!result) return false

    if (format === EMatchFormat.SingleMatch) {
      // Cannot be draw
      return result.team1Score !== result.team2Score
    }

    if (format === EMatchFormat.BO3) {
      return (
        result.team1Score === BO3_WINNING_SCORE ||
        result.team2Score === BO3_WINNING_SCORE
      )
    }

    if (format === EMatchFormat.BO5) {
      return (
        result.team1Score === BO5_WINNING_SCORE ||
        result.team2Score === BO5_WINNING_SCORE
      )
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

  return (
    <div className="bg-[#2D2D2D] rounded-xl shadow-lg border border-gray-700/50 overflow-hidden">
      <div className="bg-[#1e1e1e] py-2 text-center border-b border-gray-700/50">
        <h1 className="text-gray-100 font-bold text-2xl md:text-3xl text-center mb-1">
          {tournamentTitle}
        </h1>
        <span className="text-gray-400 text-xs font-bold tracking-widest uppercase">
          Format: <span className="text-[#1F8EF1]">{format}</span>
        </span>
      </div>

      <div className="p-6 md:p-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center gap-4 flex-1 w-full md:w-auto">
            <h2 className="text-gray-100 font-bold text-2xl md:text-3xl text-center break-words max-w-[200px]">
              {firstTeam}
            </h2>
            <div className="mt-2">
              <Button
                onClick={() => handleScore(1)}
                variant={
                  isAllowedChangingScore
                    ? ButtonType.Primary
                    : ButtonType.Disabled
                }
              >
                {firstTeam} Wins
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center px-8">
            <div className="flex items-center gap-2">
              <span
                className={`text-6xl md:text-7xl font-mono font-bold text-gray-100`}
              >
                {result?.team1Score ?? 0}
              </span>

              <span className="text-gray-500 text-4xl mx-2 font-light">:</span>

              <span
                className={`text-6xl md:text-7xl font-mono font-bold text-gray-100`}
              >
                {result?.team2Score ?? 0}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 flex-1 w-full md:w-auto">
            <h2 className="text-gray-100 font-bold text-2xl md:text-3xl text-center break-words max-w-[200px]">
              {secondTeam}
            </h2>
            <div className="mt-2">
              <Button
                onClick={() => handleScore(2)}
                variant={
                  isAllowedChangingScore
                    ? ButtonType.Primary
                    : ButtonType.Disabled
                }
              >
                {secondTeam} Wins
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1e1e1e]/50 p-6 flex flex-col sm:flex-row justify-center gap-4 border-t border-gray-700/50">
        <Button
          onClick={confirmResult}
          variant={
            isAllowedToProceed ? ButtonType.Primary : ButtonType.Disabled
          }
        >
          Confirm Result
        </Button>
        <Button
          onClick={hanleResetScore}
          variant={isActionMade ? ButtonType.Secondary : ButtonType.Disabled}
        >
          Reset Score
        </Button>
      </div>
    </div>
  )
}

export default MatchView

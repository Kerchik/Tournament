import { ITeam } from "@/app/create/page"
import classNames from "classnames"

interface IBracketTeam extends ITeam {
  score?: number
}

interface IBracketRound {
  teams: [IBracketTeam, IBracketTeam]
  isFinished?: boolean
}

const BracketRound = ({ teams, isFinished = false }: IBracketRound) => {
  const winningTeam = !isFinished
    ? null
    : teams[0].score > teams[1].score
    ? teams[0]
    : teams[1]

  return (
    <div className="border-2 border-[#2D2D2D] rounded-sm w-full max-w-[200px]">
      <div className="border-b-1 border-[#2D2D2D] flex justify-between px-2">
        <div
          className={classNames("py-1 text-gray-300", {
            "font-bold": teams[0].id === winningTeam?.id,
          })}
        >
          {teams[0].name}
        </div>
        <div
          className={classNames(
            "border-s-1 border-[#2D2D2D] pl-2 py-1 text-gray-300 w-[18px]",
            {
              "font-bold": teams[0].id === winningTeam?.id,
            }
          )}
        >
          {teams[0].score}
        </div>
      </div>
      <div className="flex justify-between px-2">
        <div
          className={classNames("py-1 text-gray-300", {
            "font-bold": teams[1].id === winningTeam?.id,
          })}
        >
          {teams[1].name}
        </div>
        <div
          className={classNames(
            "border-s-1 border-[#2D2D2D] pl-2 py-1 text-gray-300 w-[18px]",
            {
              "font-bold": teams[1].id === winningTeam?.id,
            }
          )}
        >
          {teams[1].score}
        </div>
      </div>
    </div>
  )
}

export default BracketRound

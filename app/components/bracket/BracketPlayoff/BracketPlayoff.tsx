import { ITeam } from "@/app/create/page"
import BracketRound from "./BracketRound"

interface IBracketPlayoff {
  teams: ITeam[]
}

const BracketPlayoff = ({ teams }: IBracketPlayoff) => {
  const matches: [ITeam, ITeam][] = []
  for (let i = 0; i < teams.length; i += 2) {
    if (teams[i + 1]) {
      matches.push([teams[i], teams[i + 1]])
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {matches.map((match, index) => (
        <BracketRound key={index} teams={match} isFinished={false} />
      ))}
    </div>
  )
}

export default BracketPlayoff

import { IOption } from "../form/Select"
import { ETournamentType } from "@/app/lib/tournamentOptions"
import BracketPlayoff from "./BracketPlayoff/BracketPlayoff"
import { ITeam } from "@/app/types/teams"

interface IBracketView {
  teams: ITeam[]
  tournamentType: IOption
  matchFormat: IOption
}

const BracketView = ({ teams, tournamentType }: IBracketView) => {
  return (
    <div>
      {tournamentType.value === ETournamentType.Playoff && (
        <BracketPlayoff teams={teams} />
      )}
    </div>
  )
}

export default BracketView

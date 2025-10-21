import { ITeam } from "@/app/create/page"
import { IOption } from "../form/Select"
import { ETournamentType } from "@/app/lib/tournamentOptions"
import BracketPlayoff from "./BracketPlayoff/BracketPlayoff"

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

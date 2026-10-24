import { IOption } from "../form/Select"
import { ETournamentType } from "@/app/lib/tournamentOptions"
import BracketPlayoff from "./BracketPlayoff/BracketPlayoff"
import { ITeam } from "@/app/types/teams"
import { IBracketEditableProps } from "@/app/types/bracket"

export interface IBracketView extends IBracketEditableProps {
  teams: ITeam[]
  tournamentType: IOption
  matchFormat: IOption
}

const BracketView = ({
  teams,
  tournamentType,
  isEditable,
  onTeamsReorder,
  setTeams,
}: IBracketView) => {
  return (
    <div>
      {tournamentType.value === ETournamentType.Playoff && (
        <BracketPlayoff
          teams={teams}
          isEditable={isEditable}
          onTeamsReorder={onTeamsReorder}
          setTeams={setTeams}
        />
      )}
    </div>
  )
}

export default BracketView

import { ITeam } from "./teams"

export interface IBracketEditableProps {
  isEditable?: boolean
  onTeamsReorder?: (teams: ITeam[]) => void
  setTeams?: React.Dispatch<React.SetStateAction<ITeam[]>> | ((teams: ITeam[]) => void)
}
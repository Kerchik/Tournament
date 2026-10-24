import BracketView from "@/app/components/bracket/BracketView"
import { IOption } from "@/app/components/form/Select"
import { ITeam } from "@/app/types/teams"

interface IThirdStep {
  tournamenTitle: string
  teams: ITeam[]
  tournamentType: IOption
  matchFormat: IOption
  setTeams?: React.Dispatch<React.SetStateAction<ITeam[]>> | ((teams: ITeam[]) => void)
}

const ThirdStep = ({
  tournamenTitle,
  teams,
  tournamentType,
  matchFormat,
  setTeams,
}: IThirdStep) => {
  return (
    <div>
      <h1 className="text-gray-300 text-xl mb-2">{tournamenTitle}</h1>
      <h2 className="text-gray-300 text-lg mb-1">Preview</h2>
      <p className="text-sm text-gray-400 mb-4">
        Drag and drop teams to change their playoff bracket positions.
      </p>
      <BracketView
        teams={teams}
        tournamentType={tournamentType}
        matchFormat={matchFormat}
        isEditable={true}
        setTeams={setTeams}
      />
    </div>
  )
}

export default ThirdStep

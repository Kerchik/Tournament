import BracketView from "@/app/components/bracket/BracketView"
import { IOption } from "@/app/components/form/Select"
import { ITeam } from "@/app/types/teams"

interface IThirdStep {
  tournamenTitle: string
  teams: ITeam[]
  tournamentType: IOption
  matchFormat: IOption
}

const ThirdStep = ({
  tournamenTitle,
  teams,
  tournamentType,
  matchFormat,
}: IThirdStep) => {
  return (
    <div>
      <h1 className="text-gray-300 text-xl mb-2">{tournamenTitle}</h1>
      <h2 className="text-gray-300 text-lg mb-2">Preview</h2>
      <BracketView
        teams={teams}
        tournamentType={tournamentType}
        matchFormat={matchFormat}
      />
    </div>
  )
}

export default ThirdStep

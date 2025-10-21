import Input from "@/app/components/form/Input"
import { ITeam } from "../../page"

interface ISecondStep {
  tournamenTitle: string
  numberOfTeams: number
  teams: ITeam[]
  setTeams: React.Dispatch<React.SetStateAction<ITeam[]>>
}

const SecondStep = ({
  tournamenTitle,
  numberOfTeams,
  teams,
  setTeams,
}: ISecondStep) => {
  const handleTeamName = (id: number, name: string) => {
    setTeams((prevState) =>
      prevState.map((team) => (team.id === id ? { ...team, name } : team))
    )
  }

  return (
    <div>
      <h1 className="text-gray-300 text-xl mb-4">{tournamenTitle}</h1>
      <div className="flex flex-col gap-3">
        {teams.map((team) => (
          <div key={team.id}>
            <Input
              label=""
              value={team.name}
              setValue={(value) => handleTeamName(team.id, value)}
              placeholder={`${team.id}. team name`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SecondStep

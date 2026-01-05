import Input from "@/app/components/form/Input"
import { ITeam } from "@/app/types/teams"

interface ISecondStep {
  tournamenTitle: string
  teams: ITeam[]
  setTeams: React.Dispatch<React.SetStateAction<ITeam[]>>
}

const SecondStep = ({ tournamenTitle, teams, setTeams }: ISecondStep) => {
  const handleTeamName = (id: number, name: string) => {
    setTeams((prevState) =>
      prevState.map((team) => (team.id === id ? { ...team, name } : team))
    )
  }

  return (
    <div>
      <h1 className="text-gray-300 text-xl mb-4">{tournamenTitle}</h1>
      <div className="flex flex-col gap-2 sm:gap-4">
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

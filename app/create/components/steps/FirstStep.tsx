import Input from "@/app/components/form/Input"
import Select, { IOption } from "@/app/components/form/Select"
import { Dispatch, SetStateAction } from "react"

interface IFirstStep {
  title: string
  setTitle: Dispatch<SetStateAction<string>>
  tournamentTypes: IOption[]
  setTournamentTypes: Dispatch<SetStateAction<IOption[]>>
  matchFormat: IOption[]
  setMatchFormat: Dispatch<SetStateAction<IOption[]>>
  numberOfTeams: IOption[]
  setNumberOfTeams: Dispatch<SetStateAction<IOption[]>>
}

const FirstStep = ({
  title,
  setTitle,
  tournamentTypes,
  setTournamentTypes,
  matchFormat,
  setMatchFormat,
  numberOfTeams,
  setNumberOfTeams,
}: IFirstStep) => {
  return (
    <div className="flex flex-col gap-2">
      <Input label="Title" value={title} setValue={setTitle} id="title" />
      <Select
        label="Type"
        options={tournamentTypes}
        setValue={setTournamentTypes}
      />
      <Select label="Format" options={matchFormat} setValue={setMatchFormat} />
      <Select
        label="Number of teams"
        options={numberOfTeams}
        setValue={setNumberOfTeams}
      />
    </div>
  )
}

export default FirstStep

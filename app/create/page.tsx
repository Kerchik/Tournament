"use client"

import { SetStateAction, useContext, useMemo, useState } from "react"
import Input from "../components/form/Input"
import Select, { IOption } from "../components/form/Select"
import FirstStep from "./components/steps/FirstStep"
import StepsNavigation from "./components/steps/StepsNavigation"
import SecondStep from "./components/steps/SecondStep"
import { useTournament } from "../context/TournamentContext"
import {
  EMatchFormat,
  ETournamentType,
  MATCH_FORMATS,
  NUMBER_OF_TEAMS,
  TOURNAMENT_TYPES,
  withDefaultSelection,
} from "../lib/tournamentOptions"
import ThirdStep from "./components/steps/ThirdStep"
import { useRouter } from "next/navigation"
import { PATHS } from "../lib/paths"
import { generatePlayoffMatches } from "../lib/tournamentHelpers"

export enum ESteps {
  First = "1",
  Second = "2",
  Third = "3",
}

export interface ITeam {
  id: number
  name: string
}

const Create = () => {
  const [steps, setSteps] = useState<IOption[]>([
    {
      label: ESteps.First,
      value: ESteps.First,
      isSelected: true,
    },
    {
      label: ESteps.Second,
      value: ESteps.Second,
      isSelected: false,
    },
    {
      label: ESteps.Third,
      value: ESteps.Third,
      isSelected: false,
    },
  ])
  const selectedStep = steps.find((s) => s.isSelected)

  const [title, setTitle] = useState("")
  const [tournamentTypes, setTournamentTypes] = useState<IOption[]>(
    withDefaultSelection(TOURNAMENT_TYPES)
  )
  const [matchFormat, setMatchFormat] = useState<IOption[]>(
    withDefaultSelection(MATCH_FORMATS)
  )
  const [numberOfTeams, setNumberOfTeams] = useState<IOption[]>(
    withDefaultSelection(NUMBER_OF_TEAMS)
  )

  const [teams, setTeams] = useState<ITeam[]>([])

  const { setTournamentData } = useTournament()

  const router = useRouter()

  const selectedTournamentType = useMemo(() => {
    return tournamentTypes.find((t) => t.isSelected)
  }, [tournamentTypes])

  const selectedMatchFormat = useMemo(() => {
    return matchFormat.find((t) => t.isSelected)
  }, [matchFormat])

  const selectedNumberOfTeams = useMemo(() => {
    return numberOfTeams.find((t) => t.isSelected)
  }, [numberOfTeams])

  const getIsNextButtonActive = () => {
    switch (selectedStep?.value) {
      case ESteps.First:
        return !!(
          title &&
          selectedTournamentType &&
          selectedMatchFormat &&
          selectedNumberOfTeams
        )
      case ESteps.Second:
        return (
          // @ts-ignore
          teams.length === +selectedNumberOfTeams?.value &&
          teams.every((team) => team.name.trim().length > 0)
        )
      default:
        return false
    }
  }

  const isNextButtonActive = getIsNextButtonActive()

  const toNextStep = () => {
    const currentIndex = steps.findIndex((s) => s.isSelected)
    if (currentIndex === -1 || currentIndex === steps.length - 1) return

    const nextStep = steps[currentIndex + 1]

    // Initialize teams if going to Step 2
    if (nextStep.value === ESteps.Second) {
      // @ts-ignore
      const count = +selectedNumberOfTeams?.value || 0
      setTeams(
        Array(count)
          .fill(0)
          .map((_, i) => ({ id: i + 1, name: "" }))
      )
    }

    setSteps(
      steps.map((s, index) => ({
        ...s,
        isSelected: index === currentIndex + 1,
      }))
    )
  }

  const toPrevStep = () => {
    const currentIndex = steps.findIndex((s) => s.isSelected)
    if (currentIndex <= 0) return

    const currentStep = steps[currentIndex]
    const prevStep = steps[currentIndex - 1]

    // Clear team data when going back from Step 2
    if (currentStep.value === ESteps.Second) {
      setTeams([])
    }

    setSteps(
      steps.map((s, index) => ({
        ...s,
        isSelected: index === currentIndex - 1,
      }))
    )
  }

  const finishCreation = () => {
    setTournamentData({
      title: title,
      tournamentType: selectedTournamentType,
      matchFormat: selectedMatchFormat,
      //@ts-ignore
      numberOfTeams: +selectedNumberOfTeams.value,
      teams: teams,
      matches: generatePlayoffMatches(teams),
    })

    router.push(PATHS.TOURNAMET_PAGE)
  }

  return (
    <div>
      <StepsNavigation
        steps={steps}
        isNextButtonActive={isNextButtonActive}
        onNextButtonClick={toNextStep}
        onBackButtonClick={toPrevStep}
        onFinishClick={finishCreation}
      >
        {selectedStep?.value === ESteps.First ? (
          <FirstStep
            title={title}
            setTitle={setTitle}
            tournamentTypes={tournamentTypes}
            setTournamentTypes={setTournamentTypes}
            matchFormat={matchFormat}
            setMatchFormat={setMatchFormat}
            numberOfTeams={numberOfTeams}
            setNumberOfTeams={setNumberOfTeams}
          />
        ) : null}
        {selectedStep?.value === ESteps.Second ? (
          <SecondStep
            tournamenTitle={title}
            numberOfTeams={
              selectedNumberOfTeams?.value ? +selectedNumberOfTeams?.value : 0
            }
            teams={teams}
            setTeams={setTeams}
          />
        ) : null}
        {selectedStep?.value === ESteps.Third ? (
          <ThirdStep
            tournamenTitle={title}
            matchFormat={selectedMatchFormat as IOption}
            teams={teams}
            tournamentType={selectedTournamentType as IOption}
          />
        ) : null}
      </StepsNavigation>
    </div>
  )
}

export default Create

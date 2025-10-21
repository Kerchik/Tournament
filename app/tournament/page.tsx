"use client"

import { useMemo, useState } from "react"
import Tabs, { ITab } from "../components/form/Tabs"
import { useTournament } from "../context/TournamentContext"
import NoTournamentDataMessage from "./components/NoTournamentDataMessage"
import BracketPlayoff from "../components/bracket/BracketPlayoff/BracketPlayoff"

const TournamentPage = () => {
  const { tournamentData } = useTournament()

  const [tabs, setTabs] = useState<ITab[]>([
    { id: 1, title: "Match", isSelected: true },
    { id: 2, title: "Bracket", isSelected: false },
  ])

  const isMatchTabSelected = useMemo(() => {
    return tabs[0].isSelected
  }, [tabs])

  const isBracketTabSelected = useMemo(() => {
    return tabs[1].isSelected
  }, [tabs])

  const handleTabClick = (selectedTabId: number) => {
    setTabs(
      tabs.map((tab) => ({
        ...tab,
        isSelected: tab.id === selectedTabId,
      }))
    )
  }

  console.log(tournamentData)
  if (!tournamentData) return <NoTournamentDataMessage />

  return (
    <div>
      <Tabs tabs={tabs} onTabClick={handleTabClick} />
      {isMatchTabSelected && <div>Match</div>}
      {isBracketTabSelected && <BracketPlayoff teams={tournamentData?.teams} />}
    </div>
  )
}

export default TournamentPage

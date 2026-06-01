"use client"

import { useMemo, useState } from "react"
import Tabs, { ITab } from "../components/form/Tabs"
import { useTournament } from "../context/TournamentContext"
import NoTournamentDataMessage from "./components/NoTournamentDataMessage"
import BracketPlayoff from "../components/bracket/BracketPlayoff/BracketPlayoff"
import MatchView from "../components/match/MatchView"
import useMatchData from "../hooks/useMatchData"
import AllMatchesPlayedMessage from "./components/AllMatchesPlayedMessage"
import Button, { ButtonType } from "../components/form/Button"
import { useRouter } from "next/navigation"
import { PATHS } from "../lib/paths"

const TournamentPage = () => {
  const { tournamentData, setTournamentData } = useTournament()

  const router = useRouter()

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

  const {
    currentMatch,
    currentMatchFirstTeam,
    currentMatchSecondTeam,
    setMatchScore,
    resetScore,
    confirmMatchScore,
  } = useMatchData()

  const handleTabClick = (selectedTabId: number) => {
    setTabs(
      tabs.map((tab) => ({
        ...tab,
        isSelected: tab.id === selectedTabId,
      })),
    )
  }

  const handleMatchScore = (winningTeam: 1 | 2) => {
    if (!currentMatch) {
      console.error("Current match does not exist")
      return
    }

    setMatchScore(currentMatch.id, winningTeam)
  }

  const handleResetScore = () => {
    if (!currentMatch) {
      console.error("Current match does not exist")
      return
    }

    resetScore(currentMatch.id)
  }

  const handleMatchConfirmResult = () => {
    if (!currentMatch) {
      console.error("Current match does not exist")
      return
    }

    confirmMatchScore()
  }

  const deleteTournamentData = () => {
    setTournamentData(null)

    router.push(PATHS.HOME)
  }

  const exportTournamentData = () => {
    const jsonString = JSON.stringify(tournamentData, null, 2)

    const blob = new Blob([jsonString], { type: "application/json" })

    const url = window.URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `${tournamentData?.title.replace(/\s+/g, "_").toLowerCase()}.json`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    window.URL.revokeObjectURL(url)
  }

  if (!tournamentData) return <NoTournamentDataMessage />

  return (
    <div className="flex flex-col gap-6">
      <Tabs tabs={tabs} onTabClick={handleTabClick} />
      {isMatchTabSelected &&
        (currentMatch ? (
          <div className="w-full max-w-4xl mx-auto">
            <MatchView
              key={currentMatch?.id}
              firstTeam={currentMatchFirstTeam?.name as string}
              secondTeam={currentMatchSecondTeam?.name as string}
              format={tournamentData.matchFormat}
              result={currentMatch?.result}
              setScore={(winningTeam) => {
                handleMatchScore(winningTeam)
              }}
              resetScore={handleResetScore}
              confirmResult={handleMatchConfirmResult}
              tournamentTitle={tournamentData?.title}
            />
            <div className="mt-6 flex flex-col gap-4">
              <Button
                variant={ButtonType.Primary}
                onClick={exportTournamentData}
                additionalClassNames="w-full"
              >
                Export data
              </Button>
              <Button
                variant={ButtonType.Danger}
                onClick={deleteTournamentData}
                additionalClassNames="w-full"
              >
                Delete Tournament
              </Button>
            </div>
          </div>
        ) : (
          <AllMatchesPlayedMessage />
        ))}
      {isBracketTabSelected && (
        <BracketPlayoff
          teams={tournamentData?.teams}
          matches={tournamentData?.matches}
        />
      )}
    </div>
  )
}

export default TournamentPage

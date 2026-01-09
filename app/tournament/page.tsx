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
      }))
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

    router.push(PATHS.CREATE_PAGE)
  }

  if (!tournamentData) return <NoTournamentDataMessage />

  return (
    <div className="flex flex-col gap-6">
      <Tabs tabs={tabs} onTabClick={handleTabClick} />
      {isMatchTabSelected &&
        (currentMatch ? (
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
        ) : (
          <AllMatchesPlayedMessage />
        ))}
      {isBracketTabSelected && (
        <BracketPlayoff
          teams={tournamentData?.teams}
          matches={tournamentData?.matches}
        />
      )}
      <Button variant={ButtonType.Danger} onClick={deleteTournamentData}>
        Delete Tournament
      </Button>
    </div>
  )
}

export default TournamentPage

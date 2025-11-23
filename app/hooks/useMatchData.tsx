import { useMemo } from "react"
import { useTournament } from "../context/TournamentContext"
import { MatchStatus } from "../types/tournament"

const useMatchData = () => {
  const { tournamentData, setTournamentData } = useTournament()

  const currentMatch = useMemo(() => {
    const matches = tournamentData?.matches

    if (!matches) {
      return null
    }

    const inProgressMatch = matches.find(
      (match) => match.status === MatchStatus.IN_PROGRESS
    )

    if (inProgressMatch) {
      return inProgressMatch
    }

    return matches.find((match) => match.status === MatchStatus.SCHEDULED)
  }, [tournamentData?.matches])

  const currentMatchFirstTeam = useMemo(() => {
    if (!currentMatch) return null

    return tournamentData?.teams.find(
      (team) => team.id === currentMatch.team1Id
    )
  }, [currentMatch])

  const currentMatchSecondTeam = useMemo(() => {
    if (!currentMatch) return null

    return tournamentData?.teams.find(
      (team) => team.id === currentMatch.team2Id
    )
  }, [currentMatch])

  const setMatchScore = (matchId: number | string, winningTeam: 1 | 2) => {
    if (!tournamentData) {
      console.error("Cannot set match score: tournamentData is null.")
      return
    }

    const newMatches = tournamentData?.matches.map((match) => {
      // If this isn't the match we're looking for, return it unchanged
      if (match.id !== matchId) {
        return match
      }

      // This is the match to update.
      let newResult

      const currentResult = match.result

      if (!currentResult) {
        // 1. If result is null/undefined, create a new one.
        newResult = {
          team1Score: winningTeam === 1 ? 1 : 0,
          team2Score: winningTeam === 2 ? 1 : 0,
          winnerId: null, // Winner isn't determined until match is COMPLETED
        }
      } else {
        // 2. If result exists, increment the correct team's score.
        newResult = {
          ...currentResult,
          team1Score: currentResult.team1Score + (winningTeam === 1 ? 1 : 0),
          team2Score: currentResult.team2Score + (winningTeam === 2 ? 1 : 0),
        }
      }

      // Return a new match object with the updated status and result
      return {
        ...match,
        status: MatchStatus.IN_PROGRESS, // 1. Update status
        result: newResult, // 2. Update result
      }
    })

    setTournamentData({
      ...tournamentData,
      matches: newMatches,
    })
  }

  const resetScore = (matchId: number | string) => {
    // If tournamentData is null, we can't update it.
    if (!tournamentData) {
      console.error("Cannot reset match score: tournamentData is null.")
      return
    }

    const newMatches = tournamentData.matches.map((match) => {
      // If this isn't the match, return it unchanged
      if (match.id !== matchId) {
        return match
      }

      return {
        ...match,
        result: null,
      }
    })

    setTournamentData({
      ...tournamentData,
      matches: newMatches,
    })
  }

  const confirmMatchScore = () => {
    if (!tournamentData) {
      console.error("Cannot confirm match score: tournamentData is null.")
      return
    }

    const { matches } = tournamentData

    const completedMatch = currentMatch

    if (!completedMatch) {
      console.error("Cannot confirm match: Match ID not found.")
      return
    }

    if (!completedMatch.result) {
      console.error("Cannot confirm match with no result:", completedMatch.id)
      return
    }

    const { team1Score, team2Score } = completedMatch.result
    let winnerId: string | number | null = null
    if (team1Score > team2Score) {
      winnerId = completedMatch.team1Id
    } else if (team2Score > team1Score) {
      winnerId = completedMatch.team2Id
    }

    let nextRoundTargetId: string | number | null = null
    let slotToFill: "team1Id" | "team2Id" | null = null

    if (winnerId) {
      const nextRoundIndex = completedMatch.round.roundIndex + 1

      const nextRoundMatchTarget = matches.find(
        (match) =>
          match.round.roundIndex === nextRoundIndex &&
          (match.team1Id === null || match.team2Id === null)
      )

      if (nextRoundMatchTarget) {
        nextRoundTargetId = nextRoundMatchTarget.id
        slotToFill =
          nextRoundMatchTarget.team1Id === null ? "team1Id" : "team2Id"
      }
    }

    const newMatches = matches.map((match, index) => {
      let changes = {}

      if (index === completedMatch.id) {
        changes = {
          ...changes,
          status: MatchStatus.COMPLETED,
          result: { ...match.result!, winnerId: winnerId },
        }
      }

      // Part B: Advance the winner to the next round match
      if (winnerId && slotToFill && match.id === nextRoundTargetId) {
        changes = {
          ...changes,
          [slotToFill]: winnerId,
        }
      }

      // Part C: Start the *next sequential* match
      if (
        // @ts-expect-error Gonna be number
        index === completedMatch.id + 1 &&
        match.status === MatchStatus.SCHEDULED // Only start if it's scheduled
      ) {
        changes = {
          ...changes,
          status: MatchStatus.IN_PROGRESS,
        }
      }

      if (Object.keys(changes).length > 0) {
        return { ...match, ...changes }
      }

      return match
    })

    setTournamentData({
      ...tournamentData,
      matches: newMatches,
    })
  }

  return {
    currentMatch,
    currentMatchFirstTeam,
    currentMatchSecondTeam,
    setMatchScore,
    resetScore,
    confirmMatchScore,
  }
}

export default useMatchData

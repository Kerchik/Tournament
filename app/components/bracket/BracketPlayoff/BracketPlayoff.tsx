import BracketRound from "./BracketRound"
import { useMemo } from "react"
import { IMatch, MatchStatus } from "@/app/types/tournament"
import { IBracketTeam, ITeam } from "@/app/types/teams"
import { IBracketEditableProps } from "@/app/types/bracket"
import { useBracketDragAndDrop } from "@/app/hooks/useBracketDragAndDrop"

export interface IBracketPlayoff extends IBracketEditableProps {
  teams: ITeam[]
  matches?: IMatch[]
}

const BracketPlayoff = ({
  teams,
  matches = [],
  isEditable,
  onTeamsReorder,
  setTeams,
}: IBracketPlayoff) => {
  const { draggedTeam, pointerPos, roundDragProps } = useBracketDragAndDrop({
    teams,
    isEditable,
    onTeamsReorder,
    setTeams,
  })

  const effectiveMatches = useMemo(() => {
    if (matches && matches.length > 0) {
      return matches
    }

    const generatedFirstRound: IMatch[] = []
    for (let i = 0; i < teams.length; i += 2) {
      const team1 = teams[i]
      const team2 = teams[i + 1]

      if (team1 && team2) {
        generatedFirstRound.push({
          id: `gen-match-${i / 2}`,
          status: MatchStatus.SCHEDULED,
          round: { roundIndex: 1, name: "Round 1" },
          team1Id: team1.id,
          team2Id: team2.id,
          result: null,
        })
      }
    }
    return generatedFirstRound
  }, [teams, matches])

  const teamsMap = useMemo(
    () => new Map(teams.map((team) => [team.id, team])),
    [teams],
  )

  const rounds = useMemo(() => {
    const groupedByRound: Record<number, IMatch[]> = {}

    for (const match of effectiveMatches) {
      const roundIndex = match.round.roundIndex
      if (!groupedByRound[roundIndex]) {
        groupedByRound[roundIndex] = []
      }
      groupedByRound[roundIndex].push(match)
    }

    return Object.keys(groupedByRound)
      .sort((a, b) => Number(a) - Number(b))
      .map((roundKey) => groupedByRound[Number(roundKey)])
  }, [effectiveMatches])

  const placeholderTeam = { id: -1, name: "TBD" }

  return (
    <div className="w-full overflow-x-auto relative select-none">
      {draggedTeam && pointerPos && (
        <div
          className="fixed pointer-events-none z-50 px-3 py-1.5 rounded bg-blue-600 text-white text-xs font-semibold shadow-2xl border border-blue-400 select-none -translate-x-1/2 -translate-y-full flex items-center gap-1.5"
          style={{ left: pointerPos.x, top: pointerPos.y - 12 }}
        >
          <svg width="8" height="12" viewBox="0 0 10 14" fill="currentColor">
            <circle cx="2.5" cy="2.5" r="1.5" />
            <circle cx="7.5" cy="2.5" r="1.5" />
            <circle cx="2.5" cy="7" r="1.5" />
            <circle cx="7.5" cy="7" r="1.5" />
            <circle cx="2.5" cy="11.5" r="1.5" />
            <circle cx="7.5" cy="11.5" r="1.5" />
          </svg>
          <span>{draggedTeam.name}</span>
        </div>
      )}
      <div className="flex flex-row gap-8 items-center text-white">
        {rounds.map((roundMatches, index) => (
          <div
            key={`round-${index}`}
            className="flex flex-col gap-12 justify-around h-full"
          >
            {roundMatches.map((match) => {
              const team1 = match.team1Id
                ? (teamsMap.get(match.team1Id) ?? placeholderTeam)
                : placeholderTeam
              const team2 = match.team2Id
                ? (teamsMap.get(match.team2Id) ?? placeholderTeam)
                : placeholderTeam

              const bracketTeams: [IBracketTeam, IBracketTeam] = [
                { ...team1, score: match.result?.team1Score },
                { ...team2, score: match.result?.team2Score },
              ]

              return (
                <BracketRound
                  key={match.id}
                  teams={bracketTeams}
                  isFinished={match.status === MatchStatus.COMPLETED}
                  isEditable={isEditable}
                  {...roundDragProps}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default BracketPlayoff

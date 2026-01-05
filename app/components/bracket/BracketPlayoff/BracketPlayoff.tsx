import BracketRound from "./BracketRound"
import { useMemo } from "react"
import { IMatch, MatchStatus } from "@/app/types/tournament"
import { IBracketTeam, ITeam } from "@/app/types/teams"

interface IBracketPlayoff {
  teams: ITeam[]
  matches?: IMatch[]
}

const BracketPlayoff = ({ teams, matches = [] }: IBracketPlayoff) => {
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
    [teams]
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
    <div className="w-full overflow-x-auto">
      <div className="flex flex-row gap-8 items-center text-white">
        {rounds.map((roundMatches, index) => (
          <div
            key={`round-${index}`}
            className="flex flex-col gap-12 justify-around h-full"
          >
            {roundMatches.map((match) => {
              const team1 = match.team1Id
                ? teamsMap.get(match.team1Id) ?? placeholderTeam
                : placeholderTeam
              const team2 = match.team2Id
                ? teamsMap.get(match.team2Id) ?? placeholderTeam
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

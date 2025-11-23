import { ITeam } from '../types/teams'
import { IMatch, MatchStatus } from '../types/tournament'

const getTotalRounds = (numberOfTeams: number): number => {
  if (numberOfTeams < 2 || (numberOfTeams & (numberOfTeams - 1)) !== 0) {
    return 0;
  }
  return Math.log2(numberOfTeams);
};

const getRoundName = (roundIndex: number, totalRounds: number): string => {
  // Calculate how many steps from the final this round is
  // (totalRounds - 1) is the index of the final round
  const roundsFromFinal = (totalRounds - 1) - roundIndex;

  switch (roundsFromFinal) {
    case 0:
      return "Final";
    case 1:
      return "Semi-final";
    case 2:
      return "Quarter-final";
    default:
      // For rounds before the quarter-final, use "Round X"
      // roundIndex 0 -> "Round 1"
      return `Round ${roundIndex + 1}`;
  }
};


export const generatePlayoffMatches = (teams: ITeam[]): IMatch[]  => {
  const totalRounds = getTotalRounds(teams.length);

  if (totalRounds === 0) {
    console.error("Invalid number of teams. Must be a power of 2 (e.g., 2, 4, 8, 16).");
    return [];
  }

  const allMatches: IMatch[] = [];
  let matchIdCounter = 0;
  let matchesInCurrentRound = teams.length / 2;

  for (let roundIndex = 0; roundIndex < totalRounds; roundIndex++) {
    const roundName = getRoundName(roundIndex, totalRounds);

    for (let i = 0; i < matchesInCurrentRound; i++) {
      let team1Id: ITeam["id"] | null = null;
      let team2Id: ITeam["id"] | null = null;

      if (roundIndex === 0) {
        const team1 = teams[i * 2];
        const team2 = teams[i * 2 + 1];
        team1Id = team1.id;
        team2Id = team2.id;
      }

      const match: IMatch = {
        id: matchIdCounter++,
        status: MatchStatus.SCHEDULED,
        round: {
          roundIndex: roundIndex,
          name: roundName,
        },
        team1Id: team1Id,
        team2Id: team2Id,
        result: null,
      };

      allMatches.push(match);
    }

    matchesInCurrentRound /= 2;
  }

  return allMatches;
}
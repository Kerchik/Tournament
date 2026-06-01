import { ITeam } from '../../types/teams'
import { IMatch, ITournamentData, MatchStatus } from '../../types/tournament'

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

export function isTournamentData(data: unknown): data is ITournamentData {
  if (typeof data !== 'object' || data === null) return false;
  
  const d = data as ITournamentData;
  
  // Basic power-of-two check for teams (4, 8, 16, etc.)
  const n = d.numberOfTeams;
  const isPowerOfTwo = n >= 4 && (n & (n - 1)) === 0;
  if (!isPowerOfTwo) return false;
  
  // 2. Validate Teams count and Unique IDs
  if (!Array.isArray(d.teams) || d.teams.length !== n) return false;
  const teamIds = new Set(d.teams.map(t => t.id));
  if (teamIds.size !== n) return false; // Duplicate team IDs found
  
  // Validate Matches count (Should be n - 1)
  if (!Array.isArray(d.matches) || d.matches.length !== n - 1) return false;
  
  // Setup for structural validation
  const matchIds = new Set();
  const totalRounds = getTotalRounds(n);
  
  // Create a map to count how many matches exist per roundIndex
  const roundCounts: Record<number, number> = {};

  // Track winners of completed matches to verify progression later
  const completedMatchWinners = new Map<number | string, number | null>();
  
  for (const match of d.matches) {
    // Unique Match ID check
    if (matchIds.has(match.id)) return false;
    matchIds.add(match.id);
    
    // Validate Round Index logic
    const rIdx = match.round?.roundIndex;
    if (typeof rIdx !== 'number' || rIdx < 0 || rIdx >= totalRounds) return false;
    roundCounts[rIdx] = (roundCounts[rIdx] || 0) + 1;

    //If team IDs are assigned, they must exist in the tournament teams list
    if (match.team1Id !== null && !teamIds.has(match.team1Id)) return false;
    if (match.team2Id !== null && !teamIds.has(match.team2Id)) return false;
    
    // Status & Result Logic
    const res = match.result;
    
    if (match.status === MatchStatus.SCHEDULED) {
      if (res !== null && res !== undefined) return false;
    } 
    
    else if (match.status === MatchStatus.IN_PROGRESS) {
      if (match.team1Id === null || match.team2Id === null) return false;
      if (res?.winnerId !== null && res?.winnerId !== undefined) return false;
    } 
    
    else if (match.status === MatchStatus.COMPLETED) {
    if (!res) return false;
    if (typeof res.team1Score !== 'number' || typeof res.team2Score !== 'number') return false;
    
    // Can't complete a match without real teams
    if (match.team1Id === null || match.team2Id === null) return false;

    // Directly compare values without arrays or type casting
    if (res.winnerId !== match.team1Id && res.winnerId !== match.team2Id) {
      return false;
    }

    // Store the winner for progression safety checks
    completedMatchWinners.set(match.id, res.winnerId);
  }
  }

  // Validate math for round distribution
  // For 8 teams: Round 0 should have 4 matches, Round 1 has 2, Round 2 has 1.
  for (let i = 0; i < totalRounds; i++) {
    const expectedMatchesInRound = n / Math.pow(2, i + 1);
    if (roundCounts[i] !== expectedMatchesInRound) return false;
  }

  return true;
}
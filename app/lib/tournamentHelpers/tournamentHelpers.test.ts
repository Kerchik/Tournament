import { MatchStatus } from '../../types/tournament'
import { isTournamentData } from './tournamentHelpers'
import { EMatchFormat } from '../tournamentOptions'

describe('isTournamentData Type Guard', () => {
  
  // A valid 4-team tournament (Semi-finals + Final)
  const valid4TeamData = {
    title: "Summer Invitational",
    tournamentType: "Single Elimination",
    matchFormat: EMatchFormat.BO3,
    numberOfTeams: 4,
    teams: [
      { id: 1, name: "Team 1" }, { id: 2, name: "Team 2" },
      { id: 3, name: "Team 3" }, { id: 4, name: "Team 4" }
    ],
    matches: [
      { id: "m1", status: MatchStatus.COMPLETED, round: { roundIndex: 0, name: "Semi-final" }, team1Id: 1, team2Id: 2, result: { team1Score: 2, team2Score: 0, winnerId: 1 } },
      { id: "m2", status: MatchStatus.IN_PROGRESS, round: { roundIndex: 0, name: "Semi-final" }, team1Id: 3, team2Id: 4, result: { team1Score: 1, team2Score: 1, winnerId: null } },
      { id: "m3", status: MatchStatus.SCHEDULED, round: { roundIndex: 1, name: "Final" }, team1Id: 1, team2Id: null, result: null }
    ]
  };

  test('should return true for valid 4-team tournament data', () => {
    expect(isTournamentData(valid4TeamData)).toBe(true);
  });

  test('should return false if numberOfTeams is not a power of two (at least 4)', () => {
    const invalid = { ...valid4TeamData, numberOfTeams: 6 };
    expect(isTournamentData(invalid)).toBe(false);
  });

  test('should return false if match count is incorrect', () => {
    const invalid = { 
      ...valid4TeamData, 
      matches: [valid4TeamData.matches[0]] // Only 1 match instead of 3
    };
    expect(isTournamentData(invalid)).toBe(false);
  });

  describe('ID Uniqueness', () => {
    test('should return false if team IDs are duplicated', () => {
      const invalid = { 
        ...valid4TeamData, 
        teams: [
          { id: 1, name: "A" }, { id: 1, name: "B" }, 
          { id: 3, name: "C" }, { id: 4, name: "D" }
        ] 
      };
      expect(isTournamentData(invalid)).toBe(false);
    });

    test('should return false if match IDs are duplicated', () => {
      const invalid = {
        ...valid4TeamData,
        matches: [
          { ...valid4TeamData.matches[0], id: "dup" },
          { ...valid4TeamData.matches[1], id: "dup" },
          { ...valid4TeamData.matches[2], id: "m3" }
        ]
      };
      expect(isTournamentData(invalid)).toBe(false);
    });
  });

  describe('Status and Result logic', () => {
    test('should fail if COMPLETED match has invalid winnerId', () => {
      const invalid = JSON.parse(JSON.stringify(valid4TeamData));
      invalid.matches[0].status = MatchStatus.COMPLETED;
      invalid.matches[0].result.winnerId = 999; // ID doesn't exist in that match
      expect(isTournamentData(invalid)).toBe(false);
    });

    test('should fail if SCHEDULED match has a result object', () => {
      const invalid = JSON.parse(JSON.stringify(valid4TeamData));
      invalid.matches[2].status = MatchStatus.SCHEDULED;
      invalid.matches[2].result = { team1Score: 0, team2Score: 0 };
      expect(isTournamentData(invalid)).toBe(false);
    });

    test('should fail if IN_PROGRESS match already has a winnerId', () => {
      const invalid = JSON.parse(JSON.stringify(valid4TeamData));
      invalid.matches[1].status = MatchStatus.IN_PROGRESS;
      invalid.matches[1].result.winnerId = 3; 
      expect(isTournamentData(invalid)).toBe(false);
    });
  });

  describe('Round Structure', () => {
    test('should fail if round indices are distributed incorrectly', () => {
      const invalid = JSON.parse(JSON.stringify(valid4TeamData));
      // For 4 teams, we need 2 matches at index 0 and 1 match at index 1.
      // We'll break it by making all 3 matches roundIndex 0.
      invalid.matches[2].round.roundIndex = 0;
      expect(isTournamentData(invalid)).toBe(false);
    });
  });

  test('should return false for null or non-object input', () => {
    expect(isTournamentData(null)).toBe(false);
    expect(isTournamentData("invalid string")).toBe(false);
  });
});
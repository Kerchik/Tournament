import { EMatchFormat } from '../lib/tournamentOptions'
import { ITeam } from './teams'

export enum MatchStatus {
  SCHEDULED = "scheduled",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
}

export interface IMatchResult {
  team1Score: number;
  team2Score: number;
  winnerId?: ITeam["id"] | null;
}

export interface IMatchRound {
  roundIndex: number;
  name: string;
}

export interface IMatch {
  id: string | number;
  status: MatchStatus;
  round: IMatchRound;
  team1Id: ITeam["id"] | null;
  team2Id: ITeam["id"] | null;
  result?: IMatchResult | null;
}

export interface ITournamentData {
  title: string;
  tournamentType: string | number;
  matchFormat: EMatchFormat;
  numberOfTeams: number;
  teams: ITeam[];
  matches: IMatch[];
}
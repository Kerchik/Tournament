"use client"

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react"
import { ITeam } from "../create/page"
import { IOption } from "../components/form/Select"

interface ITournamentContextType {
  tournamentData: ITournamentData | null
  setTournamentData: Dispatch<SetStateAction<ITournamentData | null>>
}

export enum MatchStatus {
  SCEDULED = "scheduled",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
}

interface IMatchResult {
  team1Score: number
  team2Score: number
  winnerId?: ITeam["id"] | null
}

interface IMatchRound {
  roundIndex: number
  name: string
}

export interface IMatch {
  id: string | number
  status: MatchStatus
  round: IMatchRound

  team1Id: ITeam["id"] | null
  team2Id: ITeam["id"] | null

  result?: IMatchResult | null
}

interface ITournamentData {
  title: string
  tournamentType: any
  matchFormat: any
  numberOfTeams: number
  teams: ITeam[]
  matches: IMatch[]
}

const TournamentContext = createContext<ITournamentContextType | undefined>(
  undefined
)

export const TournamentProvider = ({ children }: { children: ReactNode }) => {
  const [tournamentData, setTournamentData] = useState<ITournamentData | null>(
    null
  )

  return (
    <TournamentContext.Provider value={{ tournamentData, setTournamentData }}>
      {children}
    </TournamentContext.Provider>
  )
}

export const useTournament = () => {
  const context = useContext(TournamentContext)
  if (!context) {
    throw new Error("useTournament must be used within TournamentProvider")
  }
  return context
}

"use client"

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react"
import { ITournamentData } from "../types/tournament"

interface ITournamentContextType {
  tournamentData: ITournamentData | null
  setTournamentData: Dispatch<SetStateAction<ITournamentData | null>>
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

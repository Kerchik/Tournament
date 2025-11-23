export interface ITeam {
  id: number
  name: string
}

export interface IBracketTeam extends ITeam {
  score?: number
}
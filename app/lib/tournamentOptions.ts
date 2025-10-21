export enum ETournamentType {
  Playoff = "Playoff",
}

export enum EMatchFormat {
  SingleMatch = "Single Match",
  BO3 = "Best of three",
  BO5 = "Best of five",
}

export const TOURNAMENT_TYPES = [
    {
      value: ETournamentType.Playoff,
      label: ETournamentType.Playoff,
    },
]

export const MATCH_FORMATS = [
    {
      value: EMatchFormat.SingleMatch,
      label: EMatchFormat.SingleMatch,
    },
    {
      value: EMatchFormat.BO3,
      label: EMatchFormat.BO3,
    },
    {
      value: EMatchFormat.BO5,
      label: EMatchFormat.BO5,
    },
]

export const NUMBER_OF_TEAMS = [
    {
      value: "4",
      label: "4",
    },
    {
      value: "8",
      label: "8",
    },
    {
      value: "16",
      label: "16",
    },
    {
      value: "32",
      label: "32",
    },
]

export const withDefaultSelection = <T extends { value: any; label: string }>(
  options: T[]
): (T & { isSelected: boolean })[] =>
  options.map((opt, idx) => ({
    ...opt,
    isSelected: idx === 0,
  }));


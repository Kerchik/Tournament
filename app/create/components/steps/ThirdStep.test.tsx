/**
 * @jest-environment jsdom
 */
import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import ThirdStep from "./ThirdStep"
import { ETournamentType } from "@/app/lib/tournamentOptions"
import { ITeam } from "@/app/types/teams"

if (typeof window.PointerEvent === "undefined") {
  class PointerEvent extends MouseEvent {
    pointerId: number
    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params)
      this.pointerId = params.pointerId || 0
    }
  }
  // @ts-expect-error polyfill for jsdom
  window.PointerEvent = PointerEvent
}

describe("ThirdStep component", () => {
  const teams: ITeam[] = [
    { id: 1, name: "Team 1" },
    { id: 2, name: "Team 2" },
    { id: 3, name: "Team 3" },
    { id: 4, name: "Team 4" },
  ]

  const tournamentType = {
    label: "Playoff",
    value: ETournamentType.Playoff,
    isSelected: true,
  }

  const matchFormat = {
    label: "BO1",
    value: "BO1",
    isSelected: true,
  }

  it("renders ThirdStep with preview and editable bracket", () => {
    const handleSetTeams = jest.fn()

    render(
      <ThirdStep
        tournamenTitle="Championship 2026"
        teams={teams}
        tournamentType={tournamentType}
        matchFormat={matchFormat}
        setTeams={handleSetTeams}
      />
    )

    expect(screen.getByText("Championship 2026")).toBeInTheDocument()
    expect(screen.getByText("Preview")).toBeInTheDocument()
    expect(
      screen.getByText(/Drag and drop teams to change their playoff bracket positions/i)
    ).toBeInTheDocument()

    // Teams are rendered with drag handles
    const handles = screen.getAllByTitle("Drag to reorder")
    expect(handles.length).toBe(4)
  })

  it("reorders teams when dragging and dropping via pointer events in ThirdStep", () => {
    const handleSetTeams = jest.fn()

    render(
      <ThirdStep
        tournamenTitle="Championship 2026"
        teams={teams}
        tournamentType={tournamentType}
        matchFormat={matchFormat}
        setTeams={handleSetTeams}
      />
    )

    const team2Row = screen.getByText("Team 2").closest("[data-team-id]")!
    const team3Row = screen.getByText("Team 3").closest("[data-team-id]")!

    document.elementFromPoint = jest.fn().mockImplementation((x: number, y: number) => {
      if (x === 50 && y === 50) return team3Row
      return team2Row
    })

    fireEvent.pointerDown(team2Row, { clientX: 10, clientY: 10, pointerId: 1 })
    fireEvent.pointerMove(team2Row, { clientX: 50, clientY: 50, pointerId: 1 })
    fireEvent.pointerUp(team2Row, { clientX: 50, clientY: 50, pointerId: 1 })

    expect(handleSetTeams).toHaveBeenCalledTimes(1)
    const updatedTeams: ITeam[] = handleSetTeams.mock.calls[0][0]
    expect(updatedTeams.map((t) => t.id)).toEqual([1, 3, 2, 4])
  })
})

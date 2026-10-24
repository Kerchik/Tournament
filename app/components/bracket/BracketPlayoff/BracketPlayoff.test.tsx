/**
 * @jest-environment jsdom
 */
import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import BracketPlayoff from "./BracketPlayoff"
import BracketRound from "./BracketRound"
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

describe("BracketRound", () => {
  const teams: [{ id: number; name: string }, { id: number; name: string }] = [
    { id: 1, name: "Team Alpha" },
    { id: 2, name: "Team Beta" },
  ]

  it("renders teams in non-editable mode without drag handles", () => {
    render(<BracketRound teams={teams} isEditable={false} />)
    expect(screen.getByText("Team Alpha")).toBeInTheDocument()
    expect(screen.getByText("Team Beta")).toBeInTheDocument()

    expect(screen.queryByTitle("Drag to reorder")).not.toBeInTheDocument()
    const alphaEl = screen.getByText("Team Alpha").closest("[data-team-id]")
    expect(alphaEl).not.toHaveClass("cursor-grab")
  })

  it("renders teams in editable mode with drag handles and touch-none", () => {
    render(<BracketRound teams={teams} isEditable={true} />)
    const handles = screen.getAllByTitle("Drag to reorder")
    expect(handles).toHaveLength(2)

    const alphaEl = screen.getByText("Team Alpha").closest("[data-team-id]")
    expect(alphaEl).toHaveClass("cursor-grab")
    expect(alphaEl).toHaveClass("touch-none")
  })
})

describe("BracketPlayoff drag and drop", () => {
  const initialTeams: ITeam[] = [
    { id: 1, name: "Team 1" },
    { id: 2, name: "Team 2" },
    { id: 3, name: "Team 3" },
    { id: 4, name: "Team 4" },
  ]

  it("does not allow drag-and-drop when isEditable is false", () => {
    const handleReorder = jest.fn()
    render(
      <BracketPlayoff
        teams={initialTeams}
        isEditable={false}
        onTeamsReorder={handleReorder}
      />
    )

    const team1El = screen.getByText("Team 1").closest("[data-team-id]")
    expect(team1El).not.toHaveClass("cursor-grab")
    expect(screen.queryByTitle("Drag to reorder")).not.toBeInTheDocument()
  })

  it("allows reordering teams via pointer events (mouse/touch)", () => {
    const handleReorder = jest.fn()
    render(
      <BracketPlayoff
        teams={initialTeams}
        isEditable={true}
        onTeamsReorder={handleReorder}
      />
    )

    const team1Row = screen.getByText("Team 1").closest("[data-team-id]")!
    const team4Row = screen.getByText("Team 4").closest("[data-team-id]")!

    document.elementFromPoint = jest.fn().mockImplementation((x: number, y: number) => {
      if (x === 100 && y === 100) return team4Row
      return team1Row
    })

    // Pointer down on Team 1
    fireEvent.pointerDown(team1Row, { clientX: 10, clientY: 10, pointerId: 1, button: 0 })
    expect(team1Row).toHaveClass("opacity-40")

    // Pointer move over Team 4
    fireEvent.pointerMove(team1Row, { clientX: 100, clientY: 100, pointerId: 1 })
    expect(team4Row).toHaveClass("ring-2")

    // Pointer up
    fireEvent.pointerUp(team1Row, { clientX: 100, clientY: 100, pointerId: 1 })

    expect(handleReorder).toHaveBeenCalledTimes(1)
    const newTeams: ITeam[] = handleReorder.mock.calls[0][0]
    expect(newTeams.map((t) => t.id)).toEqual([4, 2, 3, 1])
  })

  it("cancels pointer drag on Escape key", () => {
    render(
      <BracketPlayoff
        teams={initialTeams}
        isEditable={true}
      />
    )

    const team1Row = screen.getByText("Team 1").closest("[data-team-id]")!
    fireEvent.pointerDown(team1Row, { clientX: 10, clientY: 10, pointerId: 1, button: 0 })
    expect(team1Row).toHaveClass("opacity-40")

    fireEvent.keyDown(window, { key: "Escape" })
    expect(team1Row).not.toHaveClass("opacity-40")
  })

  it("does not swap if pointer is released on itself", () => {
    const handleReorder = jest.fn()
    render(
      <BracketPlayoff
        teams={initialTeams}
        isEditable={true}
        onTeamsReorder={handleReorder}
      />
    )

    const team1Row = screen.getByText("Team 1").closest("[data-team-id]")!
    document.elementFromPoint = jest.fn().mockReturnValue(team1Row)

    fireEvent.pointerDown(team1Row, { clientX: 10, clientY: 10, pointerId: 1, button: 0 })
    fireEvent.pointerUp(team1Row, { clientX: 10, clientY: 10, pointerId: 1 })

    expect(handleReorder).not.toHaveBeenCalled()
  })

  it("resets drag state on pointercancel", () => {
    render(
      <BracketPlayoff
        teams={initialTeams}
        isEditable={true}
      />
    )

    const team1Row = screen.getByText("Team 1").closest("[data-team-id]")!
    fireEvent.pointerDown(team1Row, { clientX: 10, clientY: 10, pointerId: 1, button: 0 })
    expect(team1Row).toHaveClass("opacity-40")

    fireEvent.pointerCancel(team1Row)
    expect(team1Row).not.toHaveClass("opacity-40")
  })
})

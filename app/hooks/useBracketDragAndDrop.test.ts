/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react"
import { useBracketDragAndDrop } from "./useBracketDragAndDrop"
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

describe("useBracketDragAndDrop hook", () => {
  const initialTeams: ITeam[] = [
    { id: 1, name: "Team 1" },
    { id: 2, name: "Team 2" },
    { id: 3, name: "Team 3" },
    { id: 4, name: "Team 4" },
  ]

  it("initializes with empty drag state", () => {
    const { result } = renderHook(() =>
      useBracketDragAndDrop({ teams: initialTeams, isEditable: true })
    )

    expect(result.current.draggedTeamId).toBeNull()
    expect(result.current.dragOverTeamId).toBeNull()
    expect(result.current.draggedTeam).toBeNull()
    expect(result.current.pointerPos).toBeNull()
  })

  it("updates draggedTeamId and pointerPos on pointerDown", () => {
    const { result } = renderHook(() =>
      useBracketDragAndDrop({ teams: initialTeams, isEditable: true })
    )

    act(() => {
      const mockEvent = {
        clientX: 50,
        clientY: 100,
        pointerId: 1,
        button: 0,
        currentTarget: {
          setPointerCapture: jest.fn(),
        },
      } as unknown as React.PointerEvent
      result.current.handlePointerDown(mockEvent, { id: 1, name: "Team 1" })
    })

    expect(result.current.draggedTeamId).toBe(1)
    expect(result.current.draggedTeam?.name).toBe("Team 1")
    expect(result.current.pointerPos).toEqual({ x: 50, y: 100 })
  })

  it("resets state when clearDragState is called or on Escape key", () => {
    const { result } = renderHook(() =>
      useBracketDragAndDrop({ teams: initialTeams, isEditable: true })
    )

    act(() => {
      const mockEvent = {
        clientX: 10,
        clientY: 20,
        pointerId: 1,
        button: 0,
        currentTarget: {
          setPointerCapture: jest.fn(),
        },
      } as unknown as React.PointerEvent
      result.current.handlePointerDown(mockEvent, { id: 1, name: "Team 1" })
    })

    expect(result.current.draggedTeamId).toBe(1)
    expect(result.current.draggedTeam?.name).toBe("Team 1")

    // Press Escape to cancel
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
    })

    expect(result.current.draggedTeamId).toBeNull()
    expect(result.current.draggedTeam).toBeNull()
  })

  it("swaps teams on pointerUp and notifies callbacks", () => {
    const handleReorder = jest.fn()
    const handleSetTeams = jest.fn()

    const { result } = renderHook(() =>
      useBracketDragAndDrop({
        teams: initialTeams,
        isEditable: true,
        onTeamsReorder: handleReorder,
        setTeams: handleSetTeams,
      })
    )

    // Pointer down on Team 1
    act(() => {
      const mockEvent = {
        clientX: 10,
        clientY: 20,
        pointerId: 1,
        button: 0,
        currentTarget: {
          setPointerCapture: jest.fn(),
        },
      } as unknown as React.PointerEvent
      result.current.handlePointerDown(mockEvent, { id: 1, name: "Team 1" })
    })

    // Pointer move over Team 3
    act(() => {
      result.current.handlePointerEnter(
        {} as React.PointerEvent,
        { id: 3, name: "Team 3" }
      )
    })

    expect(result.current.dragOverTeamId).toBe(3)

    // Pointer up
    act(() => {
      const mockUpEvent = {
        clientX: 10,
        clientY: 20,
        pointerId: 1,
        currentTarget: {
          releasePointerCapture: jest.fn(),
        },
      } as unknown as React.PointerEvent
      result.current.handlePointerUp(mockUpEvent)
    })

    expect(handleReorder).toHaveBeenCalledTimes(1)
    expect(handleSetTeams).toHaveBeenCalledTimes(1)
    const swapped: ITeam[] = handleReorder.mock.calls[0][0]
    expect(swapped.map((t) => t.id)).toEqual([3, 2, 1, 4])
    expect(result.current.draggedTeamId).toBeNull()
  })
})

import { useState, useRef, useCallback, useEffect, useMemo } from "react"
import { IBracketTeam, ITeam } from "@/app/types/teams"

export interface IUseBracketDragAndDropParams {
  teams: ITeam[]
  isEditable?: boolean
  onTeamsReorder?: (teams: ITeam[]) => void
  setTeams?: React.Dispatch<React.SetStateAction<ITeam[]>> | ((teams: ITeam[]) => void)
}

export const useBracketDragAndDrop = ({
  teams,
  isEditable = false,
  onTeamsReorder,
  setTeams,
}: IUseBracketDragAndDropParams) => {
  const [draggedTeamId, setDraggedTeamId] = useState<number | null>(null)
  const [dragOverTeamId, setDragOverTeamId] = useState<number | null>(null)
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(
    null,
  )

  const activeDragRef = useRef<{
    teamId: number
    pointerId: number
  } | null>(null)

  const handleReorder = useCallback(
    (newTeams: ITeam[]) => {
      onTeamsReorder?.(newTeams)
      if (setTeams) {
        setTeams(newTeams)
      }
    },
    [onTeamsReorder, setTeams],
  )

  const swapTeams = useCallback(
    (sourceId: number, targetId: number) => {
      if (sourceId === targetId || sourceId === -1 || targetId === -1) return

      const sourceIndex = teams.findIndex((t) => t.id === sourceId)
      const targetIndex = teams.findIndex((t) => t.id === targetId)

      if (sourceIndex !== -1 && targetIndex !== -1) {
        const newTeams = [...teams]
        const temp = newTeams[sourceIndex]
        newTeams[sourceIndex] = newTeams[targetIndex]
        newTeams[targetIndex] = temp

        handleReorder(newTeams)
      }
    },
    [teams, handleReorder],
  )

  const clearDragState = useCallback(() => {
    activeDragRef.current = null
    setDraggedTeamId(null)
    setDragOverTeamId(null)
    setPointerPos(null)
  }, [])

  // Pointer event handlers (works seamlessly for mouse, touch, mobile, DevTools touch emulation)
  const handlePointerDown = useCallback(
    (e: React.PointerEvent, team: IBracketTeam) => {
      if (!isEditable || team.id === -1) return
      if (e.button !== undefined && e.button > 0) return

      activeDragRef.current = {
        teamId: team.id,
        pointerId: e.pointerId,
      }

      setDraggedTeamId(team.id)
      setDragOverTeamId(null)
      setPointerPos({ x: e.clientX, y: e.clientY })

      try {
        e.currentTarget.setPointerCapture(e.pointerId)
      } catch {
        // safe fallback
      }
    },
    [isEditable],
  )

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!activeDragRef.current) return

    setPointerPos({ x: e.clientX, y: e.clientY })

    let targetId: number | null = null
    if (
      typeof document !== "undefined" &&
      typeof document.elementFromPoint === "function"
    ) {
      const el = document.elementFromPoint(e.clientX, e.clientY)
      const targetRow = el?.closest("[data-team-id]")
      const idStr = targetRow?.getAttribute("data-team-id")
      targetId = idStr ? Number(idStr) : null
    }

    if (
      targetId !== null &&
      !isNaN(targetId) &&
      targetId !== -1 &&
      targetId !== activeDragRef.current.teamId
    ) {
      setDragOverTeamId(targetId)
    } else {
      setDragOverTeamId(null)
    }
  }, [])

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent, team: IBracketTeam) => {
      if (!activeDragRef.current) return
      if (team.id !== -1 && team.id !== activeDragRef.current.teamId) {
        setDragOverTeamId(team.id)
      }
    },
    [],
  )

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!activeDragRef.current) return

      const sourceId = activeDragRef.current.teamId

      let targetId = dragOverTeamId
      if (
        targetId === null &&
        typeof document !== "undefined" &&
        typeof document.elementFromPoint === "function"
      ) {
        const el = document.elementFromPoint(e.clientX, e.clientY)
        const targetRow = el?.closest("[data-team-id]")
        const idStr = targetRow?.getAttribute("data-team-id")
        targetId = idStr ? Number(idStr) : null
      }

      if (
        targetId !== null &&
        !isNaN(targetId) &&
        targetId !== -1 &&
        targetId !== sourceId
      ) {
        swapTeams(sourceId, targetId)
      }

      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {
        // safe fallback
      }

      clearDragState()
    },
    [dragOverTeamId, swapTeams, clearDragState],
  )

  // Global cancel listeners to guarantee state never hangs
  useEffect(() => {
    const handleGlobalEnd = () => {
      clearDragState()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        clearDragState()
      }
    }

    window.addEventListener("pointerup", handleGlobalEnd)
    window.addEventListener("pointercancel", handleGlobalEnd)
    window.addEventListener("blur", handleGlobalEnd)
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("pointerup", handleGlobalEnd)
      window.removeEventListener("pointercancel", handleGlobalEnd)
      window.removeEventListener("blur", handleGlobalEnd)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [clearDragState])

  const draggedTeam = useMemo(() => {
    if (draggedTeamId === null) return null
    return teams.find((t) => t.id === draggedTeamId) ?? null
  }, [teams, draggedTeamId])

  const roundDragProps = useMemo(
    () => ({
      draggedTeamId,
      dragOverTeamId,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerEnter: handlePointerEnter,
      onPointerCancel: clearDragState,
    }),
    [
      draggedTeamId,
      dragOverTeamId,
      handlePointerDown,
      handlePointerMove,
      handlePointerUp,
      handlePointerEnter,
      clearDragState,
    ],
  )

  return {
    draggedTeamId,
    dragOverTeamId,
    draggedTeam,
    pointerPos,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerEnter,
    clearDragState,
    roundDragProps,
  }
}

export default useBracketDragAndDrop

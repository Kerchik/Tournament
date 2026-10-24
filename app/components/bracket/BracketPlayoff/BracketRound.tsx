import { IBracketTeam } from "@/app/types/teams"
import classNames from "classnames"

interface IBracketRound {
  teams: [IBracketTeam, IBracketTeam]
  isFinished?: boolean
  isEditable?: boolean
  draggedTeamId?: number | null
  dragOverTeamId?: number | null
  onPointerDown?: (e: React.PointerEvent, team: IBracketTeam) => void
  onPointerMove?: (e: React.PointerEvent, team: IBracketTeam) => void
  onPointerUp?: (e: React.PointerEvent, team: IBracketTeam) => void
  onPointerEnter?: (e: React.PointerEvent, team: IBracketTeam) => void
  onPointerCancel?: (e: React.PointerEvent, team: IBracketTeam) => void
}

const BracketRound = ({
  teams,
  isFinished = false,
  isEditable = false,
  draggedTeamId,
  dragOverTeamId,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerEnter,
  onPointerCancel,
}: IBracketRound) => {
  const winningTeam =
    !isFinished || teams[0].score === undefined || teams[1].score === undefined
      ? null
      : teams[0].score > teams[1].score
      ? teams[0]
      : teams[1]

  const renderTeamRow = (team: IBracketTeam, isFirst: boolean) => {
    const isWinner = winningTeam !== null && winningTeam?.id === team.id
    const isDraggable = Boolean(isEditable && team.id !== -1)
    const isBeingDragged = draggedTeamId === team.id
    const isDropTarget = dragOverTeamId === team.id && draggedTeamId !== team.id

    return (
      <div
        data-team-id={team.id}
        onPointerDown={(e) => isDraggable && onPointerDown?.(e, team)}
        onPointerMove={(e) => isDraggable && onPointerMove?.(e, team)}
        onPointerUp={(e) => isDraggable && onPointerUp?.(e, team)}
        onPointerEnter={(e) => isDraggable && onPointerEnter?.(e, team)}
        onPointerCancel={(e) => isDraggable && onPointerCancel?.(e, team)}
        className={classNames(
          "flex justify-between items-stretch px-2 transition-colors relative",
          isFirst && "border-b-1 border-[#2D2D2D]",
          isDraggable &&
            "cursor-grab active:cursor-grabbing select-none touch-none",
          isBeingDragged && "opacity-40 bg-[#222222] cursor-grabbing",
          isDraggable && !isBeingDragged && !isDropTarget && "hover:bg-[#252525]",
          isDropTarget && "bg-blue-600/30 ring-2 ring-blue-500 ring-inset",
        )}
      >
        <div
          className={classNames(
            "py-1 text-gray-300 flex items-center truncate min-w-0 flex-1",
            {
              "font-bold": isWinner,
            },
          )}
        >
          {isDraggable && (
            <span
              className="text-gray-500 mr-1.5 flex items-center shrink-0 cursor-grab active:cursor-grabbing"
              title="Drag to reorder"
            >
              <svg
                width="10"
                height="14"
                viewBox="0 0 10 14"
                fill="currentColor"
                className="text-gray-400"
              >
                <circle cx="2.5" cy="2.5" r="1.5" />
                <circle cx="7.5" cy="2.5" r="1.5" />
                <circle cx="2.5" cy="7" r="1.5" />
                <circle cx="7.5" cy="7" r="1.5" />
                <circle cx="2.5" cy="11.5" r="1.5" />
                <circle cx="7.5" cy="11.5" r="1.5" />
              </svg>
            </span>
          )}
          <span className="truncate">{team.name}</span>
        </div>
        <div
          className={classNames(
            "self-stretch flex items-center justify-end border-s-1 border-[#2D2D2D] pl-2 text-gray-300 w-[18px] shrink-0 text-right",
            {
              "font-bold": isWinner,
            },
          )}
        >
          {team.score}
        </div>
      </div>
    )
  }

  return (
    <div className="border-2 border-[#2D2D2D] rounded-sm w-[200px]">
      {renderTeamRow(teams[0], true)}
      {renderTeamRow(teams[1], false)}
    </div>
  )
}

export default BracketRound

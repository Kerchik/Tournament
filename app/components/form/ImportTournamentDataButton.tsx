import { useTournament } from "@/app/context/TournamentContext"
import Button, { ButtonType } from "./Button"
import { useRouter } from "next/navigation"
import { PATHS } from "@/app/lib/paths"
import { isTournamentData } from "@/app/lib/tournamentHelpers/tournamentHelpers"

const ImportTournamentDataButton = () => {
  const { setTournamentData } = useTournament()

  const router = useRouter()

  const importTournamentData = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json,application/json"

    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement
      const file = target.files?.[0]

      if (!file) return

      const reader = new FileReader()

      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const content = e.target?.result as string

          const parsedData = JSON.parse(content)

          // TODO make validation
          if (!isTournamentData(parsedData)) {
            // Throwing an error safely routes execution straight to your catch block
            throw new Error(
              "Invalid tournament structure or data rules mismatch.",
            )
          }

          setTournamentData(parsedData)

          router.push(PATHS.TOURNAMET_PAGE)
        } catch (error) {
          console.error("Error parsing JSON:", error)
          alert("Invalid JSON file. Please check the file format.")
        }
      }

      reader.readAsText(file)
    }

    input.click()
  }

  return (
    <Button
      variant={ButtonType.Secondary}
      onClick={importTournamentData}
      additionalClassNames="w-full sm:w-auto"
    >
      Import tournament data
    </Button>
  )
}

export default ImportTournamentDataButton

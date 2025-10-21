"use client"
import Button, { ButtonType } from "@/app/components/form/Button"
import { PATHS } from "@/app/lib/paths"
import { useRouter } from "next/navigation"

const NoTournamentDataMessage = () => {
  const router = useRouter()

  const toCreatePage = () => {
    router.push(PATHS.CREATE_PAGE)
  }

  return (
    <div className="border-2 border-[#2D2D2D] rounded-sm w-full max-w-[400px] p-4">
      <h2 className="text-gray-300 text-lg mb-2 text-justify justify-self-center">
        No tournament data exists. Go to the creation page to set up a new
        tournament.
      </h2>
      <Button variant={ButtonType.Primary} onClick={toCreatePage}>
        Create tournament
      </Button>
    </div>
  )
}

export default NoTournamentDataMessage

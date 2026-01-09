"use client"
import Button, { ButtonType } from "@/app/components/form/Button"
import MessageBlock from "@/app/components/messages/MessageBlock"
import { PATHS } from "@/app/lib/paths"
import { useRouter } from "next/navigation"

const NoTournamentDataMessage = () => {
  const router = useRouter()

  const toCreatePage = () => {
    router.push(PATHS.CREATE_PAGE)
  }

  return (
    <MessageBlock title="No tournament data exists. Go to the creation page to set up a new tournament.">
      <Button
        variant={ButtonType.Primary}
        onClick={toCreatePage}
        additionalClassNames="w-full sm:w-auto"
      >
        Create tournament
      </Button>
    </MessageBlock>
  )
}

export default NoTournamentDataMessage

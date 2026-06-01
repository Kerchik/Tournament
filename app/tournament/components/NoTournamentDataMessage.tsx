"use client"
import Button, { ButtonType } from "@/app/components/form/Button"
import ImportTournamentDataButton from "@/app/components/form/ImportTournamentDataButton"
import MessageBlock, {
  MessageBlockSize,
} from "@/app/components/messages/MessageBlock"
import { PATHS } from "@/app/lib/paths"
import { useRouter } from "next/navigation"

const NoTournamentDataMessage = () => {
  const router = useRouter()

  const toCreatePage = () => {
    router.push(PATHS.CREATE_PAGE)
  }

  return (
    <div className="flex justify-center">
      <MessageBlock
        title="No tournament data exists. Go to the creation page to set up a new tournament or import it via JSON"
        size={MessageBlockSize.Large}
      >
        <div className="flex justify-between">
          <Button
            variant={ButtonType.Primary}
            onClick={toCreatePage}
            additionalClassNames="w-full sm:w-auto"
          >
            Start new tournament
          </Button>
          <ImportTournamentDataButton />
        </div>
      </MessageBlock>
    </div>
  )
}

export default NoTournamentDataMessage

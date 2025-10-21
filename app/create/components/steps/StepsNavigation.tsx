import { IOption } from "@/app/components/form/Select"
import { JSX, ReactNode } from "react"
import { ESteps } from "../../page"
import classNames from "classnames"
import Button, { ButtonType } from "@/app/components/form/Button"

interface IStepsNavigation {
  steps: IOption[]
  children: ReactNode
  isNextButtonActive: boolean
  onNextButtonClick: () => any
  onBackButtonClick: () => any
  onFinishClick: () => any
}

const StepsNavigation = ({
  steps,
  children,
  isNextButtonActive,
  onNextButtonClick,
  onBackButtonClick,
  onFinishClick,
}: IStepsNavigation) => {
  const selectedStep = steps.find((s) => s.isSelected)

  const isLastStep = steps[steps.length - 1].isSelected
  return (
    <>
      <nav className="flex items-center justify-between gap-4 mb-6">
        {steps.map((step, index) => {
          const isSelected = step.isSelected

          return (
            <div key={step.value} className="flex flex-col items-center flex-1">
              <div
                className={classNames(
                  "w-10 h-10 flex items-center justify-center rounded-full border-2 transition-colors duration-200",
                  {
                    "bg-[#1F8EF1] text-white border-[#1F8EF1]": isSelected,
                    "bg-[#1e1e1e] text-gray-400 border-[#2D2D2D]": !isSelected,
                  }
                )}
              >
                {index + 1}
              </div>
            </div>
          )
        })}
      </nav>

      {children}
      <div className="flex justify-between mt-6">
        <Button
          additionalClassNames={classNames({
            invisible: selectedStep?.value === ESteps.First,
          })}
          onClick={onBackButtonClick}
          variant={ButtonType.Primary}
        >
          Back
        </Button>
        {isLastStep ? (
          <Button onClick={onFinishClick} variant={ButtonType.Primary}>
            Start
          </Button>
        ) : (
          <Button
            onClick={onNextButtonClick}
            variant={
              isNextButtonActive ? ButtonType.Primary : ButtonType.Disabled
            }
          >
            Next
          </Button>
        )}
      </div>
    </>
  )
}

export default StepsNavigation

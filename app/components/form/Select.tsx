import { Dispatch, SetStateAction, useRef } from "react"

export interface IOption {
  value: string | number
  label: string
  isSelected: boolean
}

interface ISelect {
  label: string
  options: IOption[]
  setValue: Dispatch<SetStateAction<IOption[]>>
}

const Select = ({ label, options, setValue }: ISelect) => {
  const ref = useRef<HTMLSelectElement>(null)

  const selectClassNames = `bg-[#1e1e1e] border border-[#2D2D2D] rounded-md px-3 py-2 text-gray-100 focus:outline-none 
    focus:ring-2 focus:ring-[#1F8EF1] focus:border-transparent transition duration-150 cursor-pointer`

  const handleSelectChange = (value: number | string) => {
    const newOptions = options.map((o) => ({
      ...o,
      isSelected: o.value === value,
    }))

    setValue(newOptions)
  }
  return (
    <div className="flex flex-col gap-1">
      <label
        className="text-sm text-gray-300 cursor-pointer"
        onClick={() => {
          ref?.current?.focus()
        }}
      >
        {label}
      </label>
      <select
        ref={ref}
        value={options.find((o) => o.isSelected)?.value ?? undefined}
        className={selectClassNames}
        onChange={(e) => handleSelectChange(e.target.value)}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-[#1e1e1e] text-gray-100"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Select

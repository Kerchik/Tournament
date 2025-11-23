import { InputHTMLAttributes } from "react"

export enum InputType {
  Text = "text",
  Number = "number",
}

interface IInput
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  label: string
  value: string
  setValue: (value: string) => void
  type?: InputType
}

const Input = ({
  label,
  value,
  setValue,
  id,
  type = InputType.Text,
  ...inputProps
}: IInput) => {
  const inputClassNames = `bg-[#1e1e1e] border border-[#2D2D2D] rounded-md px-3 py-2 text-gray-100 placeholder-gray-500 
    focus:outline-none focus:ring-2 focus:ring-[#1F8EF1] focus:border-transparent transition duration-150 cursor-pointer`

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-300 cursor-pointer" htmlFor={id}>
        {label}
      </label>
      <input
        {...inputProps}
        id={id}
        type={type}
        className={inputClassNames}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}

export default Input

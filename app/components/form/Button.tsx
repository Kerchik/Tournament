import classNames from "classnames"
import { ButtonHTMLAttributes } from "react"

export enum ButtonType {
  Primary = "primary",
  Secondary = "secondary",
  Disabled = "disabled",
}

interface IButton
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick, disabled"> {
  children?: React.JSX.Element | string
  variant: ButtonType
  onClick?: () => void
  additionalClassNames?: string
}

const Button = ({
  onClick,
  children,
  variant,
  additionalClassNames = "",
  ...buttonProps
}: IButton) => {
  const variantClassnames = classNames("px-6 py-2 rounded-md", {
    "bg-[#1F8EF1] text-gray-100 cursor-pointer hover:bg-[#2D9CDB]":
      variant === ButtonType.Primary,
    "": variant === ButtonType.Secondary,
    "bg-gray-500 text-gray-100 cursor-not-allowed":
      variant === ButtonType.Disabled,
  })

  return (
    <button
      {...buttonProps}
      onClick={onClick}
      type="button"
      disabled={variant === ButtonType.Disabled}
      className={classNames(variantClassnames, additionalClassNames)}
    >
      {children}
    </button>
  )
}

export default Button

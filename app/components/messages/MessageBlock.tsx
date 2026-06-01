"use client"
import classNames from "classnames"
import { PropsWithChildren } from "react"

export enum MessageBlockSize {
  Default = "default",
  Large = "large",
}

interface IMessageBlock extends PropsWithChildren {
  title: string | React.ReactNode
  size?: MessageBlockSize
}

const MessageBlock = ({
  title,
  size = MessageBlockSize.Default,
  children,
}: IMessageBlock) => {
  return (
    <div
      className={classNames("border-2 border-[#2D2D2D] rounded-sm w-full p-4", {
        "max-w-[400px]": size === MessageBlockSize.Default,
        "max-w-[800px]": size === MessageBlockSize.Large,
      })}
    >
      <h2 className="text-gray-300 text-lg mb-3 text-justify">{title}</h2>
      {children}
    </div>
  )
}

export default MessageBlock

"use client"
import { PropsWithChildren } from "react"

interface IMessageBlock extends PropsWithChildren {
  title: string | React.ReactNode
}

const MessageBlock = ({ title, children }: IMessageBlock) => {
  return (
    <div className="border-2 border-[#2D2D2D] rounded-sm w-full max-w-[400px] p-4">
      <h2 className="text-gray-300 text-lg mb-2 text-justify">{title}</h2>
      {children}
    </div>
  )
}

export default MessageBlock

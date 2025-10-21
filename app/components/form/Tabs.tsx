"use client"

import { useEffect, useRef, useState } from "react"

export interface ITab {
  id: number
  title: string
  isSelected: boolean
}

interface ITabs {
  tabs: ITab[]
  onTabClick: (id: number) => void
}

const Tabs = ({ tabs, onTabClick }: ITabs) => {
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 })

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    const activeTabIndex = tabs.findIndex((tab) => tab.isSelected)
    if (activeTabIndex > -1) {
      const activeTabNode = tabRefs.current[activeTabIndex]
      if (activeTabNode) {
        setUnderlineStyle({
          left: activeTabNode.offsetLeft,
          width: activeTabNode.offsetWidth,
        })
      }
    }
  }, [tabs])

  if (!tabs || tabs.length === 0) {
    return null
  }
  return (
    <div className="relative border-b-2 border-gray-700">
      <div className="flex" role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[index] = el
            }}
            type="button"
            role="tab"
            aria-selected={tab.isSelected}
            onClick={() => onTabClick(tab.id)}
            className={`px-6 py-3 text-lg font-medium transition-colors duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 focus-visible:ring-[#1F8EF1] rounded-t-md ${
              tab.isSelected
                ? "text-[#1F8EF1]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div
        className="absolute bottom-[-2px] h-1 bg-[#1F8EF1] rounded-full transition-all duration-500 ease-in-out"
        style={underlineStyle}
      />
    </div>
  )
}

export default Tabs

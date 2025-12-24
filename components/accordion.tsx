"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface AccordionItemProps {
  title: string
  children: React.ReactNode
}

function AccordionItem({ title, children }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border rounded-lg overflow-hidden mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left bg-white px-4 py-4 border-b border-[#ddd] rounded-lg text-base font-semibold cursor-pointer flex justify-between items-center hover:bg-[#f9f9f9]"
      >
        {title}
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && <div className="px-4 py-4 bg-white">{children}</div>}
    </div>
  )
}

export { AccordionItem }

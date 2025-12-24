"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"

interface RepeatableListProps {
  items: string[]
  onItemChange: (index: number, value: string) => void
  onAdd: () => void
  onRemove: (index: number) => void
  placeholder?: string
  addButtonLabel?: string
  ordered?: boolean
}

export function RepeatableList({
  items,
  onItemChange,
  onAdd,
  onRemove,
  placeholder = "Masukkan item...",
  addButtonLabel = "Tambah Item",
  ordered = false,
}: RepeatableListProps) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-3">
          {ordered && (
            <div className="flex items-center justify-center w-8 h-10 bg-muted text-muted-foreground font-medium rounded">
              {index + 1}
            </div>
          )}
          <Input
            value={item}
            onChange={(e) => onItemChange(index, e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-input text-foreground placeholder:text-muted-foreground"
          />
          <Button
            onClick={() => onRemove(index)}
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            aria-label="Hapus item"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      ))}

      <Button onClick={onAdd} variant="outline" className="w-full gap-2 bg-transparent">
        <Plus size={18} />
        {addButtonLabel}
      </Button>
    </div>
  )
}

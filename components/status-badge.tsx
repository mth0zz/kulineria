import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: "draft" | "published"
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "draft") {
    return <Badge className="bg-oranye-teralis/15 text-oranye-teralis border-oranye-teralis/30">Draft</Badge>
  }

  return <Badge className="bg-daun-hijau-tua/15 text-daun-hijau-tua border-daun-hijau-tua/30">Dipublikasikan</Badge>
}

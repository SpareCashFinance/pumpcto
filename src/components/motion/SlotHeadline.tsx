import { cn } from "@/lib/utils";

export function SlotHeadline({
  value,
  className,
}: {
  value: string;
  className?: string;
  entrance?: boolean;
}) {
  return <span className={cn("font-mono", className)}>{value}</span>;
}

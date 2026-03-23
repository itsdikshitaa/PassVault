import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground/90 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex field-sizing-content min-h-16 w-full rounded-md border bg-background/92 px-4 py-3 text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] transition-[color,box-shadow,border-color,background-color] outline-none hover:border-primary/30 hover:bg-background focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/60 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

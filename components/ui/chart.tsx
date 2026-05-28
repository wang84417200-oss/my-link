"use client"

import * as React from "react"
import * as Recharts from "recharts"

import { cn } from "@/lib/utils"

export interface ChartConfig {
  [key: string]: {
    label?: React.ReactNode
    color?: string
    icon?: React.ComponentType
  }
}

const ChartContext = React.createContext<{
  config: ChartConfig
} | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a ChartContainer.")
  }
  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ReactElement
  }
>(({ id, className, config, children, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-grid-horizontal_line]:stroke-border/50 [&_.recharts-cartesian-grid-vertical_line]:stroke-border/50 [&_.recharts-curve]:stroke-primary [&_.recharts-dot]:stroke-primary [&_.recharts-sector]:stroke-primary [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <style dangerouslySetInnerHTML={{
          __html: Object.entries(config)
            .map(([key, value]) => {
              if (!value.color) return ""
              return `
                [data-chart="${chartId}"] {
                  --color-${key}: ${value.color};
                }
              `
            })
            .join("\n")
        }} />
        <Recharts.ResponsiveContainer>
          {children}
        </Recharts.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = Recharts.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    active?: boolean
    payload?: any[]
    label?: string
    hideLabel?: boolean
  }
>(({ active, payload, label, hideLabel, className }, ref) => {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-border/10 bg-card/90 p-3 shadow-2xl backdrop-blur-md text-[13px] font-medium tracking-tight",
        className
      )}
    >
      {!hideLabel && <div className="mb-1.5 font-bold text-foreground/90">{label}</div>}
      <div className="flex flex-col gap-1">
        {payload.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1.5 text-muted-foreground">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: item.color || item.payload.fill }}
            />
            <span className="font-bold text-foreground/90">
              {item.value?.toLocaleString()}회 클릭
            </span>
          </div>
        ))}
      </div>
    </div>
  )
})
ChartTooltipContent.displayName = "ChartTooltipContent"

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
}

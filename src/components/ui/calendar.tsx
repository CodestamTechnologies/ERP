"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface CalendarProps {
  mode?: "single" | "multiple" | "range"
  selected?: Date | Date[] | { from: Date; to?: Date }
  onSelect?: (date: Date | Date[] | { from: Date; to?: Date } | undefined) => void
  className?: string
  disabled?: (date: Date) => boolean
  showOutsideDays?: boolean
  captionLayout?: "buttons" | "dropdown"
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

function Calendar({
  mode = "single",
  selected,
  onSelect,
  className,
  disabled,
  showOutsideDays = true,
  captionLayout = "buttons",
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear())

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    if (!selected) return false
    
    if (mode === "single") {
      return selected instanceof Date && date.toDateString() === selected.toDateString()
    }
    
    if (mode === "multiple") {
      return Array.isArray(selected) && selected.some(d => d.toDateString() === date.toDateString())
    }
    
    if (mode === "range") {
      const range = selected as { from: Date; to?: Date }
      if (!range.from) return false
      if (!range.to) return date.toDateString() === range.from.toDateString()
      return date >= range.from && date <= range.to
    }
    
    return false
  }

  const handleDateClick = (date: Date) => {
    if (disabled?.(date)) return

    if (mode === "single") {
      onSelect?.(date)
    } else if (mode === "multiple") {
      const currentSelected = (selected as Date[]) || []
      const isAlreadySelected = currentSelected.some(d => d.toDateString() === date.toDateString())
      
      if (isAlreadySelected) {
        onSelect?.(currentSelected.filter(d => d.toDateString() !== date.toDateString()))
      } else {
        onSelect?.([...currentSelected, date])
      }
    } else if (mode === "range") {
      const range = (selected as { from: Date; to?: Date }) || { from: new Date(), to: undefined }
      
      if (!range.from || (range.from && range.to)) {
        onSelect?.({ from: date, to: undefined })
      } else if (range.from && !range.to) {
        if (date < range.from) {
          onSelect?.({ from: date, to: range.from })
        } else {
          onSelect?.({ from: range.from, to: date })
        }
      }
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    }
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
    const daysInPrevMonth = getDaysInMonth(currentMonth - 1, currentYear)
    
    const days = []

    // Previous month's days
    if (showOutsideDays) {
      for (let i = firstDay - 1; i >= 0; i--) {
        const date = new Date(currentYear, currentMonth - 1, daysInPrevMonth - i)
        days.push(
          <button
            key={`prev-${daysInPrevMonth - i}`}
            onClick={() => handleDateClick(date)}
            className={cn(
              "h-9 w-9 p-0 font-normal text-muted-foreground opacity-50 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors",
              disabled?.(date) && "cursor-not-allowed opacity-25"
            )}
            disabled={disabled?.(date)}
          >
            {daysInPrevMonth - i}
          </button>
        )
      }
    } else {
      for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-9 w-9" />)
      }
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      const selected = isSelected(date)
      const today = isToday(date)
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          className={cn(
            "h-9 w-9 p-0 font-normal rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
            today && "bg-accent text-accent-foreground font-medium",
            selected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            disabled?.(date) && "cursor-not-allowed opacity-25"
          )}
          disabled={disabled?.(date)}
        >
          {day}
        </button>
      )
    }

    // Next month's days
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7
    const remainingCells = totalCells - (firstDay + daysInMonth)
    
    if (showOutsideDays) {
      for (let day = 1; day <= remainingCells; day++) {
        const date = new Date(currentYear, currentMonth + 1, day)
        days.push(
          <button
            key={`next-${day}`}
            onClick={() => handleDateClick(date)}
            className={cn(
              "h-9 w-9 p-0 font-normal text-muted-foreground opacity-50 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors",
              disabled?.(date) && "cursor-not-allowed opacity-25"
            )}
            disabled={disabled?.(date)}
          >
            {day}
          </button>
        )
      }
    }

    return days
  }

  const renderCaption = () => {
    if (captionLayout === "dropdown") {
      return (
        <div className="flex items-center justify-center space-x-2">
          <select
            value={currentMonth}
            onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
            className="flex h-9 w-auto items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            {MONTHS.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>
          <select
            value={currentYear}
            onChange={(e) => setCurrentYear(parseInt(e.target.value))}
            className="flex h-9 w-auto items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            {Array.from({ length: 21 }, (_, i) => currentYear - 10 + i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      )
    }

    return (
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateMonth("prev")}
          className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium">
          {MONTHS[currentMonth]} {currentYear}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateMonth("next")}
          className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("p-3", className)} {...props}>
      <div className="space-y-4">
        {/* Caption */}
        <div className="flex justify-center pt-1 relative items-center">
          {renderCaption()}
        </div>

        {/* Calendar Grid */}
        <div className="w-full border-collapse space-y-1">
          {/* Days of week header */}
          <div className="flex">
            {DAYS.map((day) => (
              <div
                key={day}
                className="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] h-9 flex items-center justify-center"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendarDays()}
          </div>
        </div>
      </div>
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
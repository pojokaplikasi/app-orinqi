import React, { useState } from "react"

interface HeroFormProps {
  date: string
  setDate: (date: string) => void
  time: string
  setTime: (time: string) => void
  timezone: string
  setTimezone: (timezone: string) => void
  gender: number | null
  setGender: (gender: number | null) => void
  unknownTime: boolean
  setUnknownTime: (unknownTime: boolean) => void
  mode: "classic" | "modern"
  setMode: (mode: "classic" | "modern") => void
  onCalculate: () => void
  loading: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  baziData?: any
  /** Ref forwarded from page — StickyHeader watches this element's position */
  heroRef?: React.RefObject<HTMLDivElement | null>
  /** Lifted state so StickyHeader can read chartName */
  chartName: string
  setChartName: (name: string) => void
}

export default function HeroForm({
  date,
  setDate,
  time,
  setTime,
  timezone,
  setTimezone,
  gender,
  setGender,
  unknownTime,
  setUnknownTime,
  mode,
  setMode,
  onCalculate,
  loading,
  baziData,
  heroRef,
  chartName,
  setChartName,
}: HeroFormProps) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState("")

  const handleEditClick = () => {
    setTempName(chartName)
    setIsEditingName(true)
  }

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault()
    if (tempName.trim()) {
      setChartName(tempName.trim())
    }
    setIsEditingName(false)
  }

  // If data is present, show the static hero info card
  if (baziData) {
    return (
      <>
        {/* Hero card — StickyHeader watches this element's bottom edge */}
        <div ref={heroRef} className="w-full px-0 py-4">
          <div className="mx-auto w-full max-w-[1800px]">
            <div className="group relative overflow-hidden rounded-[24px] border border-border bg-card p-5 shadow-sm">
              {/* Decorative background removed for performance */}

              <div className="relative z-10 flex items-center justify-between gap-4">
                {/* Left: Avatar + Info + Toggle */}
                <div className="flex flex-1 items-center gap-4">
                  <div className="flex h-[80px] w-[80px] shrink-0 items-center justify-center rounded-full border-4 border-background/80 bg-gradient-to-br from-primary to-primary/80 shadow-[0_4px_20px_rgba(var(--primary),0.4)]">
                    <span className="font-serif text-4xl font-bold text-primary-foreground">命</span>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <h2 className="text-[28px] font-bold tracking-tight text-foreground">{chartName}</h2>
                      <button
                        onClick={handleEditClick}
                        className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-background/60 hover:text-primary"
                        title="Edit Name"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                      </button>
                    </div>
                    <p className="text-[15px] font-medium text-muted-foreground">
                      {new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      {!unknownTime && time && ` • ${time}`}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-[12px] font-semibold text-muted-foreground shadow-sm">{gender === 1 ? "Male" : "Female"}</span>
                      <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-[12px] font-semibold text-muted-foreground shadow-sm">{timezone.split("/").pop()?.replace(/_/g, " ") || timezone}</span>
                      <div className="flex rounded-[12px] border border-border bg-background/60 p-0.5 shadow-sm">
                        <button type="button" onClick={() => setMode("classic")} className={`rounded-[10px] px-3 py-1 text-[12px] font-semibold transition-colors ${mode === "classic" ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Classic</button>
                        <button type="button" onClick={() => setMode("modern")} className={`rounded-[10px] px-3 py-1 text-[12px] font-semibold transition-colors ${mode === "modern" ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Modern</button>
                      </div>
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>

        {/* Edit Name Dialog */}
        {isEditingName && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={() => setIsEditingName(false)}
          >
            <div
              className="flex w-full max-w-md flex-col overflow-hidden rounded-[24px] bg-background shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border p-6">
                <h3 className="text-[20px] font-bold text-foreground">
                  Edit Chart Name
                </h3>
                <button
                  onClick={() => setIsEditingName(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSaveName} className="p-6">
                <div className="mb-6">
                  <label className="mb-2 block text-[14px] font-medium text-muted-foreground">
                    Name
                  </label>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="h-[56px] w-full rounded-[16px] border border-input bg-background px-4 text-[16px] text-foreground transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none"
                    placeholder="e.g. Hendro's Chart"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingName(false)}
                    className="rounded-[12px] px-6 py-2.5 text-[14px] font-medium text-muted-foreground transition-colors hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-[12px] bg-primary px-6 py-2.5 text-[14px] font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                  >
                    Save Name
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="relative flex min-h-[600px] w-full flex-col items-center justify-center overflow-hidden bg-background px-4 py-16 sm:px-6 lg:px-8">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-300">
          <div className="mb-6 flex h-[80px] w-[80px] animate-pulse items-center justify-center rounded-full border-4 border-border bg-gradient-to-br from-primary to-primary/80 shadow-sm">
            <span className="font-serif text-4xl font-bold text-primary-foreground">
              命
            </span>
          </div>
          <h3 className="mb-2 text-[24px] font-bold text-foreground">
            Calculating Destiny...
          </h3>
          <p className="text-[15px] text-muted-foreground">
            Analyzing heavenly stems and earthly branches
          </p>
        </div>
      )}

      {/* Decorative Background Elements */}
      <div className="pointer-events-none absolute top-0 left-0 z-0 h-full w-full overflow-hidden">
        {/* Subtle Cloud/Wave Pattern - Top Right */}
        <svg
          className="absolute top-[-10%] right-[-5%] h-[50%] w-[50%] text-primary opacity-[0.03]"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.3,-46.3C90.8,-33.5,96.8,-18.1,97.4,-2.4C98.1,13.3,93.4,29.3,84.3,42.5C75.2,55.7,61.7,66.1,46.8,73.1C31.9,80.1,15.9,83.7,0.3,83.2C-15.3,82.7,-30.6,78.1,-44.2,70.2C-57.8,62.3,-69.7,51.1,-78.1,37.5C-86.5,23.9,-91.4,7.9,-89.8,-7.3C-88.2,-22.5,-80.1,-36.9,-69.5,-48.4C-58.9,-59.9,-45.8,-68.5,-32.1,-75.1C-18.4,-81.7,-4.1,-86.3,10.5,-85.5C25.1,-84.7,30.6,-83.6,44.7,-76.4Z"
            transform="translate(100 100)"
          />
        </svg>
        {/* Subtle Cloud/Wave Pattern - Bottom Left */}
        <svg
          className="absolute bottom-[-10%] left-[-5%] h-[60%] w-[60%] text-primary opacity-[0.03]"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M39.9,-65.7C54.1,-60.5,69.6,-53.8,79.5,-41.9C89.4,-30,93.7,-12.9,91.3,3.4C88.9,19.7,79.8,35.2,68.1,47.4C56.4,59.6,42.1,68.5,26.6,73.5C11.1,78.5,-5.6,79.6,-21.5,75.4C-37.4,71.2,-52.5,61.7,-63.4,49.1C-74.3,36.5,-81,20.8,-82.6,4.7C-84.2,-11.4,-80.7,-27.9,-71.6,-40.8C-62.5,-53.7,-47.8,-63,-33.4,-68.5C-19,-74,-4.5,-75.7,9.1,-73.1C22.7,-70.5,35.4,-63.6,39.9,-65.7Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col items-center">
        {/* Hero Header */}
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center justify-center">
            {/* App Mark (Seal) */}
            <div className="mr-4 flex h-[56px] w-[56px] items-center justify-center rounded-full border-2 border-border bg-gradient-to-br from-primary to-primary/80 shadow-sm md:h-[72px] md:w-[72px]">
              <span className="font-serif text-2xl font-bold text-primary-foreground md:text-3xl">
                命
              </span>
            </div>
            <h1 className="text-[40px] leading-tight font-bold tracking-tight text-foreground md:text-[48px]">
              Bazi Calculator
            </h1>
          </div>
          <p className="text-[16px] font-medium tracking-wide text-muted-foreground md:text-[18px]">
            Chinese Four Pillars Destiny Reading
          </p>
        </div>

        {/* Main Form Container (Liquid Glass) */}
        <div className="w-full rounded-[24px] border border-border bg-card p-6 shadow-sm md:p-8 lg:p-10">
          {/* Desktop: 3 columns, Mobile: 1 column */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Date Input */}
            <div className="flex flex-col">
              <label className="mb-2 ml-1 text-[14px] font-medium text-muted-foreground">
                Date of Birth
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="h-[56px] w-full appearance-none rounded-[16px] border border-input bg-background px-4 text-[16px] text-foreground transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            {/* Time Input */}
            <div className="flex flex-col">
              <label
                className="mb-2 ml-1 text-[14px] font-medium text-muted-foreground transition-opacity duration-200"
                style={{ opacity: unknownTime ? 0.5 : 1 }}
              >
                Time of Birth
              </label>
              <div className="relative">
                <input
                  type="time"
                  step="1"
                  className="h-[56px] w-full appearance-none rounded-[16px] border border-input bg-background px-4 text-[16px] text-foreground transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none disabled:bg-muted disabled:text-muted-foreground"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  disabled={unknownTime}
                  style={{ opacity: unknownTime ? 0.5 : 1 }}
                />
              </div>
            </div>

            {/* Timezone Input */}
            <div className="flex flex-col">
              <label className="mb-2 ml-1 text-[14px] font-medium text-muted-foreground">
                Timezone
              </label>
              <div className="relative">
                <select
                  className="h-[56px] w-full appearance-none rounded-[16px] border border-input bg-background px-4 pr-10 text-[16px] text-foreground transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  <option value="" disabled>
                    Select Timezone
                  </option>
                  <option value="Etc/GMT+12">(UTC-12:00) International Date Line West</option>
                  <option value="Pacific/Midway">(UTC-11:00) Pacific/Midway, US/Samoa</option>
                  <option value="Pacific/Honolulu">(UTC-10:00) Pacific/Honolulu, US/Hawaii</option>
                  <option value="America/Anchorage">(UTC-09:00) America/Anchorage, US/Alaska</option>
                  <option value="America/Los_Angeles">(UTC-08:00) America/Los_Angeles</option>
                  <option value="America/Denver">(UTC-07:00) America/Denver</option>
                  <option value="America/Chicago">(UTC-06:00) America/Chicago</option>
                  <option value="America/New_York">(UTC-05:00) America/New_York</option>
                  <option value="America/Halifax">(UTC-04:00) America/Halifax</option>
                  <option value="America/Argentina/Buenos_Aires">(UTC-03:00) America/Argentina/Buenos_Aires</option>
                  <option value="America/Noronha">(UTC-02:00) America/Noronha</option>
                  <option value="Atlantic/Cape_Verde">(UTC-01:00) Atlantic/Cape_Verde</option>
                  <option value="GMT">(UTC+00:00) UTC, GMT</option>
                  <option value="Europe/London">(UTC+01:00) Europe/London</option>
                  <option value="Europe/Helsinki">(UTC+02:00) Europe/Helsinki</option>
                  <option value="Europe/Moscow">(UTC+03:00) Europe/Moscow</option>
                  <option value="Asia/Dubai">(UTC+04:00) Asia/Dubai</option>
                  <option value="Asia/Karachi">(UTC+05:00) Asia/Karachi</option>
                  <option value="Asia/Dhaka">(UTC+06:00) Asia/Dhaka</option>
                  <option value="Asia/Bangkok">(UTC+07:00) Asia/Bangkok</option>
                  <option value="Asia/Ho_Chi_Minh">(UTC+07:00) Asia/Ho_Chi_Minh</option>
                  <option value="Asia/Jakarta">(UTC+07:00) Asia/Jakarta</option>
                  <option value="Asia/Singapore">(UTC+08:00) Asia/Singapore</option>
                  <option value="Asia/Shanghai">(UTC+08:00) Asia/Shanghai</option>
                  <option value="Asia/Taipei">(UTC+08:00) Asia/Taipei</option>
                  <option value="Asia/Tokyo">(UTC+09:00) Asia/Tokyo</option>
                  <option value="Asia/Seoul">(UTC+09:00) Asia/Seoul</option>
                  <option value="Australia/Brisbane">(UTC+10:00) Australia/Brisbane</option>
                  <option value="Australia/Sydney">(UTC+10:00) Australia/Sydney</option>
                  <option value="Pacific/Noumea">(UTC+11:00) Pacific/Noumea</option>
                  <option value="Pacific/Auckland">(UTC+12:00) Pacific/Auckland</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Row */}
          <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            {/* Left side: Gender & Unknown Time */}
            <div className="flex w-full flex-col items-start gap-6 md:w-auto md:flex-row md:items-center">
              {/* Gender Segmented Control */}
              <div className="flex w-full flex-col md:w-auto">
                <label className="mb-2 ml-1 text-[14px] font-medium text-muted-foreground md:hidden">
                  Gender
                </label>
                <div className="flex w-full rounded-[16px] bg-muted p-1 md:w-auto">
                  <button
                    type="button"
                    onClick={() => setGender(0)}
                    className={`flex-1 rounded-[12px] px-6 py-2.5 text-[15px] font-medium transition-all duration-200 md:flex-none ${gender === 0 ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Female
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender(1)}
                    className={`flex-1 rounded-[12px] px-6 py-2.5 text-[15px] font-medium transition-all duration-200 md:flex-none ${gender === 1 ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Male
                  </button>
                </div>
              </div>

              {/* Unknown Time Checkbox */}
              <label className="group mt-2 flex cursor-pointer items-center gap-3 md:mt-0">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={unknownTime}
                    onChange={(e) => setUnknownTime(e.target.checked)}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-[6px] border-2 border-input transition-all duration-200 checked:border-primary checked:bg-primary focus:ring-4 focus:ring-primary/10 focus:outline-none"
                  />
                  <svg
                    className="pointer-events-none absolute h-3 w-3 text-primary-foreground opacity-0 transition-opacity duration-200 peer-checked:opacity-100"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className="text-[15px] text-muted-foreground transition-colors duration-200 select-none group-hover:text-foreground">
                  I don&apos;t know my birth time
                </span>
              </label>
            </div>
          </div>

          {/* Bottom Row: Calculate Button & Mode Toggle */}
          <div className="flex flex-col items-center gap-8">
            {/* Calculate Button */}
            <button
              onClick={onCalculate}
              disabled={loading}
              className="flex h-[56px] w-full min-w-[280px] items-center justify-center rounded-[18px] bg-gradient-to-r from-primary to-secondary text-[16px] font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:active:scale-100 md:w-auto"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 animate-spin text-primary-foreground"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Calculating...</span>
                </div>
              ) : (
                "Calculate"
              )}
            </button>

            {/* Classic / Modern Toggle (Liquid Glass) */}
            <div className="flex rounded-[16px] border border-border bg-card/50 p-1 shadow-sm backdrop-blur-md">
              <button
                type="button"
                onClick={() => setMode("classic")}
                className={`rounded-[12px] px-6 py-2 text-[14px] font-medium transition-all duration-200 ${mode === "classic" ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"}`}
              >
                Classic
              </button>
              <button
                type="button"
                onClick={() => setMode("modern")}
                className={`rounded-[12px] px-6 py-2 text-[14px] font-medium transition-all duration-200 ${mode === "modern" ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"}`}
              >
                Modern
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

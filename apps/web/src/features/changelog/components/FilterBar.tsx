import { useEffect, useState } from "react"
import { ChevronDownIcon } from "@hugeicons/core-free-icons"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Icon } from "@workspace/ui/components/icon"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Switch } from "@workspace/ui/components/switch"
import { CHANGELOG_AREAS, CHANGELOG_TYPES, areaLabel, publicAreas, typeLabel } from "../utils"
import type { ChangelogArea, ChangelogEntryType, ChangelogSearch } from "../types"

interface FilterBarProps {
  search: ChangelogSearch
  onFilterChange: (search: ChangelogSearch) => void
  activeFilterCount: number
}

export function FilterBar({
  search,
  onFilterChange,
  activeFilterCount,
}: FilterBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(search.q || "")

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search.q) {
        onFilterChange({ ...search, q: searchInput || undefined })
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput, search, onFilterChange])

  // Update local input when search param changes externally
  useEffect(() => {
    setSearchInput(search.q || "")
  }, [search.q])

  const handleTypeFilter = (type: ChangelogEntryType | undefined) => {
    onFilterChange({ ...search, type })
  }

  const handleAreaFilter = (area: ChangelogArea | undefined) => {
    onFilterChange({ ...search, area })
  }

  const handleShowInternal = (checked: boolean) => {
    onFilterChange({ ...search, showInternal: checked || undefined })
  }

  const areaOptions = search.showInternal ? CHANGELOG_AREAS : publicAreas()

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
  }

  const handleClearAll = () => {
    onFilterChange({})
    setSearchInput("")
  }

  const allTypesActive = !search.type && !search.area

  return (
    <>
      {/* Mobile: Collapsible filter bar */}
      <div className="md:hidden mb-6">
        <Button
          variant="outline"
          className="w-full h-11 justify-between px-4 focus-visible:ring-2"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <span className="flex items-center gap-2">
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="success" size="sm" className="ml-auto">
                {activeFilterCount}
              </Badge>
            )}
          </span>
          <Icon
            icon={ChevronDownIcon}
            className={`transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
          />
        </Button>

        {/* Collapsible content */}
        {isFilterOpen && (
          <div className="mt-3 space-y-3 p-4 bg-surface-raised rounded-lg border border-border">
            {/* Category chips - scrollable row on mobile */}
            <div>
              <p className="text-label mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={allTypesActive ? "default" : "outline"}
                  size="sm"
                  className="cursor-pointer transition-all h-9 px-3 py-1 focus-visible:ring-2"
                  onClick={() => handleTypeFilter(undefined)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleTypeFilter(undefined)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  All
                </Badge>
                {CHANGELOG_TYPES.map((type) => (
                  <Badge
                    key={type}
                    variant={search.type === type ? "default" : "outline"}
                    size="sm"
                    className="cursor-pointer transition-all h-9 px-3 py-1 focus-visible:ring-2"
                    onClick={() => handleTypeFilter(type)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleTypeFilter(type)
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    {typeLabel(type)}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Area dropdown */}
            <div>
              <label className="text-label block mb-2">Area</label>
              <Select
                value={search.area || "all"}
                onValueChange={(v) => handleAreaFilter(v === "all" ? undefined : (v as ChangelogArea))}
              >
                <SelectTrigger className="w-full h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All areas</SelectItem>
                  {areaOptions.map((area) => (
                    <SelectItem key={area} value={area}>
                      {areaLabel(area)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div>
              <label className="text-label block mb-2">Search</label>
              <Input
                placeholder="Search entries..."
                value={searchInput}
                onChange={handleSearchChange}
                className="h-11"
              />
            </div>

            {/* Internal changes toggle (URL-backed) */}
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="changelog-show-internal" className="text-label">
                Show internal changes
              </label>
              <Switch
                id="changelog-show-internal"
                checked={Boolean(search.showInternal)}
                onCheckedChange={handleShowInternal}
              />
            </div>

            {/* Clear button */}
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                className="w-full h-9 text-text-secondary"
                onClick={handleClearAll}
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Desktop: Always visible filter bar */}
      <div className="hidden md:flex gap-4 mb-8 items-center flex-wrap">
        {/* Category chips */}
        <div className="flex gap-2 flex-wrap">
          <Badge
            variant={allTypesActive ? "default" : "outline"}
            size="sm"
            className="cursor-pointer transition-all h-9 px-3 py-1 focus-visible:ring-2"
            onClick={() => handleTypeFilter(undefined)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleTypeFilter(undefined)
              }
            }}
            role="button"
            tabIndex={0}
          >
            All
          </Badge>
          {CHANGELOG_TYPES.map((type) => (
            <Badge
              key={type}
              variant={search.type === type ? "default" : "outline"}
              size="sm"
              className="cursor-pointer transition-all h-9 px-3 py-1 focus-visible:ring-2"
              onClick={() => handleTypeFilter(type)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleTypeFilter(type)
                }
              }}
              role="button"
              tabIndex={0}
            >
              {typeLabel(type)}
            </Badge>
          ))}
        </div>

        {/* Area dropdown */}
        <Select
          value={search.area || "all"}
          onValueChange={(v) => handleAreaFilter(v === "all" ? undefined : (v as ChangelogArea))}
        >
          <SelectTrigger className="w-48 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All areas</SelectItem>
            {CHANGELOG_AREAS.map((area) => (
              <SelectItem key={area} value={area}>
                {areaLabel(area)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search */}
        <Input
          placeholder="Search..."
          value={searchInput}
          onChange={handleSearchChange}
          className="h-9 flex-1 min-w-xs"
        />

        {/* Internal changes toggle (URL-backed) */}
        <div className="flex items-center gap-2">
          <Switch
            id="changelog-show-internal"
            checked={Boolean(search.showInternal)}
            onCheckedChange={handleShowInternal}
          />
          <label htmlFor="changelog-show-internal" className="text-label">
            Show internal changes
          </label>
        </div>
      </div>
    </>
  )
}

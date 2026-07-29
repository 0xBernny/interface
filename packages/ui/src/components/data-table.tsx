import * as React from 'react'

import { cn } from '@workspace/ui/lib/utils'
import { Skeleton } from '@workspace/ui/components/skeleton'

interface Column<T> {
  id: string
  header: string
  accessor: (row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Array<Column<T>>
  data: Array<T>
  isLoading?: boolean
  emptyMessage?: string
  emptyAction?: React.ReactNode
  keyExtractor: (row: T) => string
  onRowClick?: (row: T) => void
  className?: string
}

function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No data',
  emptyAction,
  keyExtractor,
  onRowClick,
  className,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div data-slot="data-table-loading" className={cn('space-y-1', className)}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            {columns.map((col) => (
              <Skeleton
                key={col.id}
                className={cn('h-4 flex-1', col.className)}
              />
            ))}
          </div>
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div
        data-slot="data-table-empty"
        className={cn(
          'flex flex-col items-center justify-center gap-3 py-16 text-center',
          className,
        )}
      >
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        {emptyAction}
      </div>
    )
  }

  return (
    <div data-slot="data-table" className={cn('overflow-x-auto', className)}>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/20 text-left">
            {columns.map((col) => (
              <th
                key={col.id}
                className={cn('px-5 py-3 font-medium text-muted-foreground', col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              tabIndex={onRowClick ? 0 : undefined}
              onKeyDown={
                onRowClick
                  ? (e: React.KeyboardEvent) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onRowClick(row)
                      }
                    }
                  : undefined
              }
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                'border-b border-border/40 transition-colors last:border-b-0',
                onRowClick && 'cursor-pointer hover:bg-muted/20',
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.id}
                  className={cn('px-5 py-3.5', col.className)}
                >
                  {col.accessor(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export { DataTable }
export type { Column, DataTableProps }

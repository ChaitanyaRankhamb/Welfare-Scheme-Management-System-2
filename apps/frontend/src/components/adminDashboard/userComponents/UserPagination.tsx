import React from 'react'
import { Button } from '@/components/ui/button'

interface UserPaginationProps {
  page: number
  setPage: (page: number) => void
  total: number
  limit: number
  loading?: boolean
}

export const UserPagination = ({ page, setPage, total, limit, loading }: UserPaginationProps) => {
  const totalPages = Math.ceil(total / limit)
  const start = total > 0 ? (page - 1) * limit + 1 : 0
  const end = Math.min(page * limit, total)

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-white/50 text-sm">
      <span className="text-gray-500 font-medium">
        {total > 0 ? `${start}–${end} of ${total}` : '0–0 of 0'}
      </span>
      <div className="flex items-center gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setPage(page - 1)} 
          disabled={page === 1 || loading} 
          className={`rounded-xl border-gray-200 dark:border-white/10 ${page === 1 ? 'cursor-not-allowed opacity-50' : 'hover:border-indigo-500!'}cursor-pointer!`}
        >
          Prev
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setPage(page + 1)} 
          disabled={page === totalPages || total === 0 || loading} 
          className={`rounded-xl border-gray-200 dark:border-white/10 ${page === totalPages || total === 0 ? 'cursor-not-allowed opacity-50' : 'hover:border-indigo-500!'} cursor-pointer!`}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

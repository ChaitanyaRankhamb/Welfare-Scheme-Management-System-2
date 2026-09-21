import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Filter } from 'lucide-react'

interface UserFiltersProps {
  searchTerm: string
  setSearchTerm: (val: string) => void
  status: 'all' | 'active' | 'inactive'
  setStatus: (status: 'all' | 'active' | 'inactive') => void
}

export const UserFilters = ({ searchTerm, setSearchTerm, status, setStatus }: UserFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
      {/* Search Bar */}
      <div className="relative w-full max-w-sm group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
        <input
          type="text"
          placeholder="Search users by name or email..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/50 dark:bg-zinc-950/50 border border-gray-200/50 dark:border-white/10 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2 w-full md:w-auto">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap">
          <Filter className="w-3.5 h-3.5" />
          Filter:
        </span>
        <Select value={status} onValueChange={(val: any) => setStatus(val)}>
          <SelectTrigger className="w-[180px] rounded-xl border-gray-200 dark:border-white/10 bg-white/50 dark:bg-zinc-950/50">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-gray-200 dark:border-white/10">
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="active">Active Users</SelectItem>
            <SelectItem value="inactive">Deactivated Users</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

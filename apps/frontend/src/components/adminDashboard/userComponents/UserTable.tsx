'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Trash2,
  MoreVertical,
  UserX,
  UserCheck,
  Eye,
  FileText,
  Search,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { userAPI } from '@/components/api/userAPI'

// Modular Components
import { UserFilters } from './UserFilters'
import { UserPagination } from './UserPagination'
import { UserProfileSidebar } from './UserProfileSidebar'
import { UserApplicationsDialog } from './UserApplicationsDialog'

interface UserTableProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  users: any[]
  total: number
  page: number
  setPage: (page: number) => void
  status: 'all' | 'active' | 'inactive'
  setStatus: (status: 'all' | 'active' | 'inactive') => void
  loading: boolean
  onRefresh: () => void
}

export const getUserId = (user: any) => {
    const id = user.id.value || user._id.value;

    // If it's already string → return
    if (typeof id === "string") return id;

    // If it's Mongo ObjectId object → extract properly
    if (id && typeof id === "object" && id.toString) {
      return id.toString();
    }

    return "";
  }

export const UserTable = ({
  searchTerm,
  setSearchTerm,
  users = [],
  total = 0,
  page,
  setPage,
  status,
  setStatus,
  loading,
  onRefresh
}: UserTableProps) => {
  // Modal & Sidebar states
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isAppsOpen, setIsAppsOpen] = useState(false)
  
  // Action loading state (per user ID)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const handleToggleStatus = async (userId: string) => {
    try {
      setActionLoading(userId)
      const res = await userAPI.toggleUserStatus(userId)
      if (res.success) {
        toast.success(res.message)
        onRefresh() // Refresh data to show updated status
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update user status")
    } finally {
      setActionLoading(null)
    }
  }

  const openProfile = (user: any) => {
    setSelectedUser(user)
    setIsProfileOpen(true)
  }

  const openApplications = (user: any) => {
    setSelectedUser(user)
    setIsAppsOpen(true)
  }

  return (
    <Card className="rounded-2xl border border-gray-200 dark:border-white/50 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-500">
      
      {/* 1. Header & Filters */}
      <div className="p-5 border-b border-gray-200 dark:border-white/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <UserFilters 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          status={status} 
          setStatus={(newStatus) => {
            setPage(1) // Reset to page 1 on filter change
            setStatus(newStatus)
          }} 
        />
      </div>

      {/* 2. Table Container */}
      <div className="relative overflow-x-auto min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        )}

        <table className="w-full text-sm">
          <thead className="bg-gray-50/50 dark:bg-zinc-950/20 text-gray-500 uppercase text-[10px] font-bold tracking-[0.15em] border-b border-gray-200 dark:border-white/10">
            <tr>
              <th className="px-6 py-4 text-left font-bold">User Identity</th>
              <th className="px-6 py-4 text-left font-bold">Status</th>
              <th className="px-6 py-4 text-left font-bold whitespace-nowrap">Role</th>
              <th className="px-6 py-4 text-left font-bold whitespace-nowrap">Registered Date</th>
              <th className="px-6 py-4 text-right font-bold w-32">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {loading && users.length === 0 ? (
                // Initial Skeleton State
                Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4"><Skeleton className="h-10 w-44 rounded-xl" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-lg" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-6 w-24 rounded-lg" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-8 w-8 ml-auto rounded-lg" /></td>
                    </tr>
                ))
            ) : users.length > 0 ? (
              users.map((user: any) => (
                <tr key={getUserId(user)} className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-all duration-300">
                  
                  {/* User Identity */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 font-bold border border-indigo-500/20 shadow-sm group-hover:scale-110 transition-transform">
                        {(user.username || user.email).charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-gray-900 dark:text-white truncate">
                          {user.username || 'Citizen User'}
                        </div>
                        <div className="text-[11px] text-gray-500 font-medium truncate">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <Badge
                      className={`text-[9px] px-2.5 py-0.5 border shadow-none font-bold uppercase tracking-widest rounded-full transition-all ${user.isActive
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                        }`}
                    >
                      {user.isActive ? 'Active' : 'Banned'}
                    </Badge>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 font-bold text-[11px] uppercase tracking-tighter text-gray-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        {user.role}
                    </div>
                  </td>

                  {/* Registered Date */}
                  <td className="px-6 py-4 text-[11px] text-gray-500 font-bold whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString('en-IN', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                    })}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                        {/* Toggle Status Action */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={actionLoading === getUserId(user)}
                                    onClick={() => handleToggleStatus(getUserId(user))}
                                    className={`h-9 w-9 rounded-xl transition-all duration-300 ${user.isActive 
                                        ? 'text-rose-500 hover:bg-rose-500/10' 
                                        : 'text-emerald-500 hover:bg-emerald-500/10'
                                    }`}
                                >
                                    {actionLoading === getUserId(user) ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : user.isActive ? (
                                        <UserX className="w-4 h-4" />
                                    ) : (
                                        <UserCheck className="w-4 h-4" />
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="font-bold text-[10px] uppercase">
                                {user.isActive ? 'Deactivate User' : 'Activate User'}
                            </TooltipContent>
                        </Tooltip>

                        {/* More Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5">
                                    <MoreVertical className="w-4 h-4 text-gray-500" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-2xl border-gray-200 dark:border-white/10 p-2 shadow-2xl">
                                <DropdownMenuItem 
                                    className="rounded-xl flex items-center gap-2 px-3 py-2.5 cursor-pointer font-bold text-xs"
                                    onClick={() => openProfile(user)}
                                >
                                    <Eye className="w-4 h-4 text-indigo-500" />
                                    View Full Profile
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-1 bg-gray-100 dark:bg-white/5" />
                                <DropdownMenuItem 
                                    className="rounded-xl flex items-center gap-2 px-3 py-2.5 cursor-pointer font-bold text-xs"
                                    onClick={() => openApplications(user)}
                                >
                                    <FileText className="w-4 h-4 text-emerald-500" />
                                    User Applications
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))
            ) : !loading && (
              <tr>
                <td colSpan={5} className="py-20 text-center animate-in fade-in duration-500">
                  <div className="flex flex-col items-center justify-center p-12 text-gray-400">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-950 rounded-2xl flex items-center justify-center mb-4 border border-gray-100 dark:border-white/5">
                        <Search className="w-8 h-8 opacity-20" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">No Users Found</h3>
                    <p className="text-xs max-w-xs mt-1 font-medium">Try adjusting your search terms or filters.</p>
                    <Button 
                        variant="link" 
                        className="text-indigo-500 text-xs font-bold mt-4 uppercase tracking-widest cursor-pointer"
                        onClick={() => {
                            setSearchTerm('')
                            setStatus('all')
                            setPage(1)
                        }}
                    >
                        Reset All Filters
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Pagination */}
      <UserPagination 
        page={page} 
        setPage={setPage} 
        total={total} 
        limit={10} 
        loading={loading}
      />

      {/* Sidebars & Modal */}
      <UserProfileSidebar 
        user={selectedUser} 
        open={isProfileOpen} 
        onOpenChange={setIsProfileOpen} 
      />

      <UserApplicationsDialog
        user={selectedUser}
        open={isAppsOpen}
        onOpenChange={setIsAppsOpen}
      />

    </Card>
  )
}
import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Trash2,
  Edit3,
  CheckCircle,
  Archive,
  RotateCcw,
  FileText,
  Layout,
  FileX
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { schemeAPI } from '@/components/api/schemeAPI'
import { toast } from 'sonner'

export const SchemeTable = ({
  searchTerm,
  setSearchTerm,
  schemes = [],
  total = 0,
  page,
  totalPages,
  setPage,
  statusFilter,
  setStatusFilter,
  onRefresh,
  onEditClick
}: any) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const limit = 10

  // Pagination handlers
  const handleNext = () => {
    if (page < totalPages) setPage((prev: number) => prev + 1)
  }
  const handlePrev = () => {
    if (page > 1) setPage((prev: number) => prev - 1)
  }

  // Status filter handler
  const handleStatusFilterChange = (val: string) => {
    setStatusFilter(val === 'all' ? undefined : val)
    setPage(1)
  }

  const start = total === 0 ? 0 : (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  // Helper to obtain a stable string identifier for a scheme
  const getSchemeId = (scheme: any) => {
    const id = scheme.id.value;

    // If it's already string → return
    if (typeof id === "string") return id;

    // If it's Mongo ObjectId object → extract properly
    if (id && typeof id === "object" && id.toString) {
      return id.toString();
    }

    return "";
  };

  // Status action (publish / archive / restore)
  const handleStatusAction = async (id: string, action: 'publish' | 'archive' | 'restore') => {
    try {
      setLoadingId(id)
      const res = await schemeAPI.updateSchemeStatus(id, action)
      if (res.success) {
        toast.success(res.message)
        onRefresh?.()
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to ${action} scheme`)
    } finally {
      setLoadingId(null)
    }
  }

  // Delete handler
  const handleDelete = async (id: string) => {
    try {
      setLoadingId(id)
      const res = await schemeAPI.deleteScheme(id)
      if (res.success) {
        toast.success(res.message)
        setConfirmDeleteId(null)
        onRefresh?.()
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete scheme')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <Card className="rounded-2xl border border-gray-200 dark:border-white/50 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-200 dark:border-white/50 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full max-w-sm group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search schemes..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/50 dark:bg-zinc-950/50 border border-gray-200/50 dark:border-white/10 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-inner"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Status filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:block">Filter:</span>
          <select
            className="bg-white/50 dark:bg-zinc-950/50 border border-gray-200/50 dark:border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer shadow-sm min-w-[140px]"
            value={statusFilter || 'all'}
            onChange={e => handleStatusFilterChange(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="drafted">Drafted</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="max-h-[500px] overflow-y-auto alert-custom-scrollbar">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur border-b border-gray-200/50 dark:border-white/10 text-xs uppercase text-gray-500 z-10">
            <tr>
              <th className="px-6 py-4 text-left">Title & Details</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Created On</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {schemes.map((scheme: any) => {
              const schemeId = getSchemeId(scheme)
              const status = scheme.status?.toLowerCase() || 'drafted'
              const isDrafted = status === 'drafted'
              const isPublished = status === 'published'
              const isArchived = status === 'archived'

              return (
                <tr key={schemeId} className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-colors">
                  {/* Scheme */}
                  <td className="px-6 py-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20 transition-transform group-hover:scale-105 shadow-sm">
                        {isDrafted && <FileText className="w-5 h-5 text-amber-600" />}
                        {isPublished && <Layout className="w-5 h-5 text-emerald-600" />}
                        {isArchived && <FileX className="w-5 h-5 text-gray-500" />}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{scheme.title}</div>
                        <div className="text-xs text-gray-500 max-w-sm truncate mt-0.5">{scheme.description}</div>
                      </div>
                    </div>
                  </td>
                  {/* Status */}
                  <td className="px-6 py-4 text-xs">
                    <Badge className={`px-2.5 py-0.5 rounded-lg border shadow-none font-bold text-[10px] uppercase tracking-wider ${isPublished ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                      isDrafted ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                        'bg-gray-500/10 text-gray-500 border-gray-500/20'
                      }`}>{status}</Badge>
                  </td>
                  {/* Created On */}
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
                    {new Date(scheme.createdAt).toLocaleDateString()}
                  </td>
                  {/* Actions */}
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">

                    {/* Draft actions */}
                    {isDrafted && (
                      <>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={loadingId === schemeId}
                              onClick={() => onEditClick(scheme)} // Trigger edit mode via callback
                              className="h-9 w-9 text-indigo-600 hover:bg-indigo-500/10 rounded-xl"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">Edit Scheme</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => handleStatusAction(schemeId, 'publish')}
                              disabled={loadingId === schemeId}
                              className="h-8 px-3 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Publish
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">Make visible to users</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            {confirmDeleteId === schemeId ? (
                              <div className="flex items-center gap-1 animate-in slide-in-from-right-2 duration-300">
                                <Button
                                  size="sm"
                                  className="text-[10px] h-8 bg-rose-500 hover:bg-rose-600 text-white rounded-lg"
                                  onClick={() => handleDelete(schemeId)}
                                >
                                  Confirm
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-[10px] h-8"
                                  onClick={() => setConfirmDeleteId(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={loadingId === schemeId}
                                onClick={() => setConfirmDeleteId(schemeId)}
                                className="h-9 w-9 text-rose-500 hover:bg-rose-500/10 rounded-xl"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </TooltipTrigger>
                          <TooltipContent side="top">Delete Scheme</TooltipContent>
                        </Tooltip>
                      </>
                    )}

                    {/* Published actions */}
                    {isPublished && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => handleStatusAction(schemeId, 'archive')}
                            disabled={loadingId === schemeId}
                            className="h-8 px-3 text-[10px] font-bold bg-rose-500 hover:bg-rose-600 text-white rounded-lg shadow-sm"
                          >
                            <Archive className="w-3 h-3 mr-1" />
                            Archive
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Hide from users</TooltipContent>
                      </Tooltip>
                    )}

                    {/* Archived actions */}
                    {isArchived && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => handleStatusAction(schemeId, 'restore')}
                            disabled={loadingId === schemeId}
                            className="h-8 px-3 text-[10px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm"
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Restore
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Move back to drafted</TooltipContent>
                      </Tooltip>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-white/50 text-sm">
        <span className="text-gray-500 font-medium">
          {total > 0 ? `${start}–${end} of ${total}` : '0–0 of 0'}
        </span>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handlePrev} disabled={page === 1} className={`rounded-xl border-gray-200 dark:border-white/10 ${page === 1 ? 'cursor-not-allowed opacity-50' : 'hover:border-indigo-500 hover:text-indigo-600'}`}>
            Prev
          </Button>
          <Button size="sm" variant="outline" onClick={handleNext} disabled={page === totalPages || total === 0} className={`rounded-xl border-gray-200 dark:border-white/10 ${page === totalPages || total === 0 ? 'cursor-not-allowed opacity-50' : 'hover:border-indigo-500 hover:text-indigo-600'}`}>
            Next
          </Button>
        </div>
      </div>
    </Card>
  )
}

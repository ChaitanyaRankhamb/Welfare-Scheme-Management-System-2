'use client'

import React, { useState, useEffect } from 'react'
import { SchemeHeader } from '@/components/adminDashboard/schemeComponents/SchemeHeader'
import { SchemeSummary } from '@/components/adminDashboard/schemeComponents/SchemeSummary'
import { SchemeTable } from '@/components/adminDashboard/schemeComponents/SchemeTable'
import { dashboardApi } from '@/components/api/adminDashboardApis/dashboardApi'
import { toast } from 'sonner'

import { schemeAPI } from '@/components/api/schemeAPI'

export default function AdminSchemesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [schemes, setSchemes] = useState<any[]>([])
  const [summaryData, setSummaryData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // Implementation of pagination with page and limit state
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalSchemes, setTotalSchemes] = useState(0)
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const limit = 10

  // State management for Add/Edit Dialog reusable across components
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedScheme, setSelectedScheme] = useState<any>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  const handleAddClick = () => {
    setSelectedScheme(null)
    setIsEditMode(false)
    setIsDialogOpen(true)
  }

  const handleEditClick = (scheme: any) => {
    setSelectedScheme(scheme)
    setIsEditMode(true)
    setIsDialogOpen(true)
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch summary stats for cards (keep all counts visible)
      const summaryRes = await dashboardApi.getAggregatedData()
      if (summaryRes.success) {
        setSummaryData(summaryRes.data.schemes)
      }

      // Fetch paginated schemes for table
      // Added status filtering state with auto-fetch
      const schemesRes = await schemeAPI.getSchemes(page, limit, statusFilter)
      if (schemesRes.success) {
        setSchemes(schemesRes.data.schemes)
        setTotalPages(schemesRes.data.totalPages)
        setTotalSchemes(schemesRes.data.totalSchemes)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load schemes data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Re-fetch data whenever page or status filter changes
    fetchData()
  }, [page, statusFilter])

  if (loading && !summaryData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse">Loading schemes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      
      {/* 1. Header with Title and CTA */}
      <SchemeHeader 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddClick={handleAddClick}
        isEditMode={isEditMode}
        selectedScheme={selectedScheme}
        onRefresh={fetchData}
      />

      {/* 2. Key Metrics Summary Grid */}
      <SchemeSummary data={summaryData} />

      {/* 3. Filterable Records Table */}
      <SchemeTable 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        schemes={schemes}
        total={totalSchemes}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onRefresh={fetchData}
        onEditClick={handleEditClick}
      />

    </div>
  )
}

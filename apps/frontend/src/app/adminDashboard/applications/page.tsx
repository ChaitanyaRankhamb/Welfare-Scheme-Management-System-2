'use client'

import React, { useState, useEffect } from 'react'
import { ApplicationHeader } from '@/components/adminDashboard/applicationComponents/ApplicationHeader'
import { ApplicationSummary } from '@/components/adminDashboard/applicationComponents/ApplicationSummary'
import { ApplicationTable } from '@/components/adminDashboard/applicationComponents/ApplicationTable'
import { applicationApi } from '@/components/api/applicationApi'
import { toast } from 'sonner'

export default function AdminApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [allApps, setAllApps] = useState<any[]>([])
  const [appStats, setAppStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [statsRes, listRes] = await Promise.all([
          applicationApi.getStats(),
          applicationApi.getAll(0, 100) // Fetching a good amount for now
        ]);

        if (statsRes.success) {
          setAppStats(statsRes.data)
        }
        if (listRes.success) {
          setAllApps(listRes.data.applications)
          setTotal(listRes.data.total)
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to load applications data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse">Loading applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      
      {/* 1. Header with Title and CTA */}
      <ApplicationHeader />

      {/* 2. Key Metrics Summary Grid */}
      <ApplicationSummary stats={appStats} />

      {/* 3. Filterable Records Table with Tabs */}
      <ApplicationTable 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        applications={allApps}
        total={total}
      />

    </div>
  )
}

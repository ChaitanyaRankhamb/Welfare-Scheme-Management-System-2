'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { UserHeader } from '@/components/adminDashboard/userComponents/UserHeader'
import { UserSummary } from '@/components/adminDashboard/userComponents/UserSummary'
import { UserTable } from '@/components/adminDashboard/userComponents/UserTable'
import { dashboardApi } from '@/components/api/adminDashboardApis/dashboardApi'
import { userAPI } from '@/components/api/userAPI'
import { toast } from 'sonner'

/**
 * @description Modern Admin User Management Page
 * Handles fetching users with pagination and status filtering.
 */
export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [summaryData, setSummaryData] = useState<any>(null)
  
  // Table State
  const [users, setUsers] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all')

  const fetchUsersData = useCallback(async () => {
    try {
      setLoading(true)
      const res = await userAPI.getUsers(page, 10, status)
      if (res.success) {
        setUsers(res.data.items)
        setTotal(res.data.meta.total)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load users")
    } finally {
      setLoading(false)
    }
  }, [page, status])

  const fetchSummary = useCallback(async () => {
    try {
      const res = await dashboardApi.getAggregatedData()
      if (res.success) {
        setSummaryData(res.data.users)
      }
    } catch (error: any) {
      console.error("Failed to load summary", error)
    }
  }, [])

  useEffect(() => {
    fetchUsersData()
  }, [fetchUsersData])

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      
      {/* 1. Header */}
      <UserHeader />

      {/* 2. Key Metrics Summary Grid */}
      <UserSummary data={summaryData} />

      {/* 3. Filterable Records Table */}
      <UserTable 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        users={users}
        total={total}
        page={page}
        setPage={setPage}
        status={status}
        setStatus={setStatus}
        loading={loading}
        onRefresh={() => {
            fetchUsersData();
            fetchSummary();
        }}
      />

    </div>
  )
}

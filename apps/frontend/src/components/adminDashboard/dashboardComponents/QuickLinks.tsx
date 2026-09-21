import React from 'react'
import Link from 'next/link'
import { Users, FolderKanban } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { GovernmentSchemeForm } from '../schemeComponents/addSchemeFormComponents/government-scheme-form'
import { schemeAPI } from '@/components/api/schemeAPI'
import { toast } from 'sonner'

const dialogScrollbarClass = `
  [&::-webkit-scrollbar]:w-[8px]
  [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar-track]:rounded-full

  [&::-webkit-scrollbar-thumb]:bg-gray-500/20
  dark:[&::-webkit-scrollbar-thumb]:bg-gray-300/20

  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb:hover]:bg-gray-500/40
  dark:[&::-webkit-scrollbar-thumb:hover]:bg-gray-300/40

  scrollbar-thin
`

export const QuickLinks = () => {
  const [open, setOpen] = React.useState(false);

  const handleSubmit = async (data: any) => {
    try {
      await schemeAPI.createScheme(data);
      toast.success('Scheme added successfully!');
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to add scheme');
    }
  };

  return (
    <div className="grid grid-cols-2 gap-5">

      {/* Manage Users */}
      <Link
        href="/adminDashboard/users"
        className="
        relative group flex flex-col items-center justify-center
        p-5 rounded-2xl
        bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl
        border border-gray-200 dark:border-white/50
        shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)]
        transition-all duration-300
        hover:border-indigo-500 dark:hover:border-indigo-500
      "
      >
        {/* Gradient Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />

        {/* Icon */}
        <div className="relative z-10 w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 transition-transform duration-300 group-hover:scale-110">
          <Users className="w-6 h-6" />
        </div>

        {/* Text */}
        <span className="relative z-10 text-sm font-semibold text-gray-800 dark:text-gray-200">
          Manage Users
        </span>
      </Link>

      {/* Add Scheme */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            className="
            relative group flex flex-col items-center justify-center
            p-5 rounded-2xl w-full
            bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl
            border border-gray-200 dark:border-white/50
            shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)]
            transition-all duration-300
            hover:border-indigo-500 dark:hover:border-indigo-500
            text-left
          "
          >
            {/* Gradient Glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />

            {/* Icon */}
            <div className="relative z-10 w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3 transition-transform duration-300 group-hover:scale-110">
              <FolderKanban className="w-6 h-6" />
            </div>

            {/* Text */}
            <span className="relative z-10 text-sm font-semibold text-gray-800 dark:text-gray-200">
              Add Scheme
            </span>
          </button>
        </DialogTrigger>
        <DialogContent className={`${dialogScrollbarClass} w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:w-[75vw] 2xl:w-[70vw] max-w-4xl max-h-[92vh] overflow-y-auto border border-white/20 bg-white backdrop-blur-2xl dark:bg-zinc-900/80 dark:border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl`}>
          <div className="p-4 sm:p-6 pb-2">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                Add New Government Scheme
              </DialogTitle>
              <DialogDescription className="text-gray-500 dark:text-gray-400">
                Fill in the details below to create a new welfare scheme. This will be visible to all eligible citizens.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="px-2 sm:px-6 pb-6">
            <GovernmentSchemeForm onSubmit={handleSubmit} />
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
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

  [&::-webkit-scrollbar-thumb]:bg-muted/20
  dark:[&::-webkit-scrollbar-thumb]:bg-muted/20

  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb:hover]:bg-muted/40
  dark:[&::-webkit-scrollbar-thumb:hover]:bg-muted/40

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
        bg-card/70 dark:bg-card/60 backdrop-blur-xl
        border border-border dark:border-border/50
        shadow-lg
        transition-all duration-300
        hover:border-primary dark:hover:border-primary
      "
      >
        {/* Gradient Glow */}
        <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />

        {/* Icon */}
        <div className="relative z-10 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary dark:text-primary mb-3 transition-transform duration-300 group-hover:scale-110">
          <Users className="w-6 h-6" />
        </div>

        {/* Text */}
        <span className="relative z-10 text-sm font-semibold text-muted-foreground dark:text-muted-foreground">
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
            bg-card/70 dark:bg-card/60 backdrop-blur-xl
            border border-border dark:border-border/50
            shadow-lg
            transition-all duration-300
            hover:border-primary dark:hover:border-primary
            text-left
          "
          >
            {/* Gradient Glow */}
            <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />

            {/* Icon */}
            <div className="relative z-10 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary dark:text-primary mb-3 transition-transform duration-300 group-hover:scale-110">
              <FolderKanban className="w-6 h-6" />
            </div>

            {/* Text */}
            <span className="relative z-10 text-sm font-semibold text-muted-foreground dark:text-muted-foreground">
              Add Scheme
            </span>
          </button>
        </DialogTrigger>
        <DialogContent className={`${dialogScrollbarClass} w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:w-[75vw] 2xl:w-[70vw] max-w-4xl max-h-[92vh] overflow-y-auto border border-border/20 bg-card backdrop-blur-2xl dark:bg-card/80 dark:border-border/50 shadow-lg rounded-2xl`}>
          <div className="p-4 sm:p-6 pb-2">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/70 dark:from-primary dark:to-primary/70">
                Add New Government Scheme
              </DialogTitle>
              <DialogDescription className="text-muted-foreground dark:text-muted-foreground">
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
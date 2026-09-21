import React from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GovernmentSchemeForm } from './addSchemeFormComponents/government-scheme-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from 'sonner'
import { schemeAPI } from '@/components/api/schemeAPI'

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

export const SchemeHeader = ({ 
  open, 
  onOpenChange, 
  onAddClick, 
  isEditMode, 
  selectedScheme, 
  onRefresh 
}: any) => {

  const handleSubmit = async (data: any) => {
    try {
      // Integrated reusable Dialog for Add/Edit modes
      if (isEditMode && selectedScheme) {
        // Resolve scheme ID robustly (handle direct ID or nested object)
        const schemeId = selectedScheme.id?.value || selectedScheme.id || selectedScheme._id;
        
        await schemeAPI.updateScheme(schemeId, data);
        toast.success('Scheme updated successfully!');
      } else {
        await schemeAPI.createScheme(data);
        toast.success('Scheme added successfully!');
      }
      onOpenChange(false); // Close modal on success
      onRefresh?.(); // Refresh data
    } catch (error: any) {
      toast.error(error?.message || `Failed to ${isEditMode ? 'update' : 'add'} scheme`);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
      {/* Left Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            Scheme Manager
          </h1>
        </div>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-xl">
          Design, publish, and manage welfare schemes across the platform.
        </p>
      </div>

      {/* Right Section (CTA) */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <Button
          onClick={onAddClick}
          className="
          group shrink-0 rounded-xl h-11 px-6
          font-semibold text-white
          bg-gradient-to-r from-indigo-600 to-violet-500
          shadow-[0_10px_25px_-5px_rgba(99,102,241,0.35)]
          hover:shadow-[0_15px_35px_-10px_rgba(99,102,241,0.5)]
          transition-all duration-300 active:scale-95
          flex items-center gap-2
        "
        >
          <Plus className="w-5 h-5 transition-transform group-hover:scale-110" />
          Add Scheme
        </Button>

        <DialogContent className={`${dialogScrollbarClass} w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:w-[75vw] 2xl:w-[70vw] max-w-4xl max-h-[92vh] overflow-y-auto border border-white/20 bg-white backdrop-blur-2xl dark:bg-zinc-900/80 dark:border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl`}>
          <div className="p-4 sm:p-6 pb-2">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                {isEditMode ? 'Edit Government Scheme' : 'Add New Government Scheme'}
              </DialogTitle>
              <DialogDescription className="text-gray-500 dark:text-gray-400">
                {isEditMode 
                  ? 'Update the details below to modify the welfare scheme.' 
                  : 'Fill in the details below to create a new welfare scheme. This will be visible to all eligible citizens.'}
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="px-2 sm:px-6 pb-6">
            <GovernmentSchemeForm 
              onSubmit={handleSubmit} 
              defaultValues={selectedScheme}
              isEditMode={isEditMode}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

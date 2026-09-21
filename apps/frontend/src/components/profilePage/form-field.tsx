'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Button, buttonVariants } from '@/components/ui/button'
import { format } from 'date-fns'
import { CalendarIcon, Info, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type FieldType =
  | 'text'
  | 'email'
  | 'number'
  | 'tel'
  | 'textarea'
  | 'select'
  | 'date'
  | 'toggle'
  | 'radio'

interface FormFieldProps {
  label: string
  name: string
  type: FieldType
  value: string | number | boolean | Date | null
  onChange: (value: any) => void
  placeholder?: string
  helperText?: string
  error?: string
  required?: boolean
  disabled?: boolean
  isLoading?: boolean
  options?: Array<{ label: string; value: string }>
  radioOptions?: Array<{ label: string; value: string }>
  tooltip?: string
}

export function FormField({
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  helperText,
  error,
  required,
  disabled,
  isLoading,
  options = [],
  radioOptions = [],
  tooltip,
}: FormFieldProps) {
  const renderField = () => {
    switch (type) {
      case 'text':
      case 'email':
      case 'number':
      case 'tel':
        return (
          <Input
            type={type}
            name={name}
            value={value as string | number}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'transition-all shadow-sm rounded-xl border-white/20 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl focus:shadow-md focus:bg-white dark:focus:bg-zinc-900 focus-visible:ring-indigo-500/30',
              error && 'border-red-500 focus-visible:ring-red-500'
            )}
          />
        )

      case 'textarea':
        return (
          <Textarea
            name={name}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'min-h-24 resize-none shadow-sm rounded-xl border-white/20 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl focus:shadow-md focus:bg-white dark:focus:bg-zinc-900 focus-visible:ring-indigo-500/30 transition-all',
              error && 'border-red-500 focus-visible:ring-red-500'
            )}
          />
        )

      case 'select':
        return (
          <Select
            value={String(value || '')}
            onValueChange={onChange}
            disabled={disabled || isLoading}
          >
            <SelectTrigger
              className={cn(
                'shadow-sm rounded-xl border-white/20 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl focus:shadow-md aria-expanded:bg-white dark:aria-expanded:bg-zinc-900 focus:ring-indigo-500/30 transition-all',
                error && 'border-red-500 focus-visible:ring-red-500'
              )}
            >
              <div className="flex items-center gap-2">
                {isLoading && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
                <SelectValue placeholder={placeholder || 'Select an option'} />
              </div>
            </SelectTrigger>
            <SelectContent
              side="bottom"
              align="start"
              sideOffset={4}
              className="rounded-md shadow-lg border-border/50"
            >
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value} className="rounded-lg">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'date':
        return (
          <Popover>
            <PopoverTrigger
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'w-full justify-start text-left font-normal shadow-sm rounded-xl border-white/20 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl hover:bg-white dark:hover:bg-zinc-900 hover:shadow-md focus:ring-indigo-500/30 transition-all',
                !value && 'text-muted-foreground',
                error && 'border-red-500'
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
              {value ? format(new Date(value as any), 'PPP') : 'Pick a date'}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl border-border/40" align="start">
              <Calendar
                mode="single"
                selected={value ? new Date(value as any) : undefined}
                onSelect={(date: Date | undefined) => onChange(date)}
                disabled={disabled}
              />
            </PopoverContent>
          </Popover>
        )

      case 'toggle':
        return (
          <div className="flex items-center gap-3">
            <Switch
              name={name}
              checked={Boolean(value)}
              onCheckedChange={onChange}
              disabled={disabled}
            />
            <span className="text-sm text-muted-foreground font-medium">{placeholder}</span>
          </div>
        )

      case 'radio':
        return (
          <RadioGroup
            value={String(value || '')}
            onValueChange={onChange}
            disabled={disabled}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {radioOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center gap-3 p-3 rounded-xl border border-white/20 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl hover:bg-white dark:hover:bg-zinc-900 transition-colors cursor-pointer shadow-sm"
                  onClick={() => !disabled && onChange(option.value)}
                >
                  <RadioGroupItem
                    value={option.value}
                    id={`${name}-${option.value}`}
                    disabled={disabled}
                  />
                  <Label
                    htmlFor={`${name}-${option.value}`}
                    className="cursor-pointer font-medium text-sm w-full"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <Label htmlFor={name} className="text-sm font-bold tracking-tight text-foreground/90">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {tooltip && (
          <div
            className="group relative cursor-help"
            title={tooltip}
          >
            <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-indigo-500 transition-colors" />
          </div>
        )}
      </div>
      {renderField()}
      {error && <p className="text-xs font-bold text-destructive animate-in fade-in slide-in-from-top-1">{error}</p>}
      {helperText && !error && (
        <p className="text-[10px] font-medium text-muted-foreground/80 pl-1">{helperText}</p>
      )}
    </div>
  )
}

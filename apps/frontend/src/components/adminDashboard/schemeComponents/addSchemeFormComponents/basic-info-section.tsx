'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { GovernmentSchemeFormData } from '@/lib/schemas/government-scheme';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BasicInfoSectionProps {
  form: UseFormReturn<GovernmentSchemeFormData>;
}

export function BasicInfoSection({ form }: BasicInfoSectionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
        <p className="text-sm text-muted-foreground">
          Enter the basic details of the government scheme
        </p>
      </div>

      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Scheme Title</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., National Health Insurance Scheme"
                {...field}
              />
            </FormControl>
            <FormDescription>The official name of the government scheme</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the purpose and benefits of this scheme..."
                className="resize-none"
                rows={4}
                {...field}
              />
            </FormControl>
            <FormDescription>Provide a detailed description of the scheme</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ministry"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ministry</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Ministry of Health and Family Welfare"
                {...field}
              />
            </FormControl>
            <FormDescription>The ministry responsible for this scheme</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />


      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Agriculture">Agriculture</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Housing">Housing</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Social Welfare">Social Welfare</SelectItem>
                <SelectItem value="Women Welfare">Women Welfare</SelectItem>
                <SelectItem value="Employment">Employment</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>The primary category of the scheme</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

'use client';

import React from 'react';
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage, 
  FormDescription 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { GovernmentSchemeFormData } from '@/lib/schemas/government-scheme';

interface ClassificationSectionProps {
  form: UseFormReturn<GovernmentSchemeFormData>;
}

export function ClassificationSection({ form }: ClassificationSectionProps) {
  return (
    <div className="space-y-6 border-t border-border pt-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Classification</h3>
        <p className="text-sm text-muted-foreground">
          Classify and organize the scheme
        </p>
      </div>

      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => {
          const tags: string[] = field.value || [];
          
          const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const input = e.currentTarget;
              const value = input.value.trim();
              
              if (value && !tags.includes(value)) {
                field.onChange([...tags, value]);
              }
              input.value = '';
            }
          };

          const handleRemoveTag = (index: number) => {
            field.onChange(tags.filter((_, i) => i !== index));
          };

          return (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Input
                    placeholder="Add a tag and press Enter"
                    onKeyDown={handleAddTag}
                  />
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(index)}
                            className="text-primary/60 hover:text-primary"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>Add tags to categorize the scheme (press Enter to add)</FormDescription>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        control={form.control}
        name="state"
        render={({ field }) => (
          <FormItem>
            <FormLabel>State</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Maharashtra, Delhi, Karnataka"
                {...field}
              />
            </FormControl>
            <FormDescription>The state where this scheme applies</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Scheme Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="drafted">Drafted</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>Set the visibility status of the scheme (defaults to Drafted)</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

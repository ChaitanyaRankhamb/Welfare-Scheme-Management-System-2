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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { GovernmentSchemeFormData } from '@/lib/schemas/government-scheme';

interface ApplicationTrackingSectionProps {
  form: UseFormReturn<GovernmentSchemeFormData>;
}

export function ApplicationTrackingSection({ form }: ApplicationTrackingSectionProps) {
  return (
    <div className="space-y-6 border-t border-border pt-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Application & Tracking</h3>
        <p className="text-sm text-muted-foreground">
          Set up application URL and tracking details
        </p>
      </div>

      <FormField
        control={form.control}
        name="applicationUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Application URL</FormLabel>
            <FormControl>
              <Input
                type="url"
                placeholder="https://example.com/apply"
                {...field}
              />
            </FormControl>
            <FormDescription>The URL where users can apply for this scheme (optional)</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="trackingMeta.type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tracking Type</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select tracking type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="direct">Direct Application</SelectItem>
                <SelectItem value="multi_step">Multi-Step Process</SelectItem>
                <SelectItem value="login_required">Login Required</SelectItem>
                <SelectItem value="none">No Tracking</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>How the application process is tracked</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="trackingMeta.instructions"
        render={({ field }) => {
          const instructions: string[] = field.value || [];

          const handleAddInstruction = () => {
            const input = document.getElementById('instruction-input') as HTMLInputElement;
            const value = input?.value?.trim();

            if (value && !instructions.includes(value)) {
              field.onChange([...instructions, value]);
              if (input) input.value = '';
            }
          };

          const handleRemoveInstruction = (index: number) => {
            field.onChange(instructions.filter((_, i) => i !== index));
          };

          const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddInstruction();
            }
          };

          return (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      id="instruction-input"
                      placeholder="e.g., Step 1: Visit the official website"
                      onKeyDown={handleKeyPress}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddInstruction}
                      className="shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {instructions.length > 0 && (
                    <div className="space-y-2">
                      {instructions.map((instruction, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 rounded-md bg-accent/10 p-3"
                        >
                          <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-foreground">{instruction}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveInstruction(index)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>Step-by-step instructions for applying to the scheme (optional)</FormDescription>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
}

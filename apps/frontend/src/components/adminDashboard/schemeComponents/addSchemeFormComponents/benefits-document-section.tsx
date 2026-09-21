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
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { GovernmentSchemeFormData } from '@/lib/schemas/government-scheme';

interface BenefitsDocumentsSectionProps {
  form: UseFormReturn<GovernmentSchemeFormData>;
}

export function BenefitsDocumentsSection({ form }: BenefitsDocumentsSectionProps) {
  return (
    <div className="space-y-6 border-t border-border pt-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Benefits & Documents</h3>
        <p className="text-sm text-muted-foreground">
          List the benefits provided and documents required
        </p>
      </div>

      <FormField
        control={form.control}
        name="benefits"
        render={({ field }) => {
          const benefits: string[] = field.value || [];

          const handleAddBenefit = () => {
            const input = document.getElementById('benefit-input') as HTMLInputElement;
            const value = input?.value?.trim();

            if (value && !benefits.includes(value)) {
              field.onChange([...benefits, value]);
              if (input) input.value = '';
            }
          };

          const handleRemoveBenefit = (index: number) => {
            field.onChange(benefits.filter((_, i) => i !== index));
          };

          const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddBenefit();
            }
          };

          return (
            <FormItem>
              <FormLabel>Benefits Provided</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      id="benefit-input"
                      placeholder="e.g., Healthcare coverage"
                      onKeyDown={handleKeyPress}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddBenefit}
                      className="shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {benefits.length > 0 && (
                    <div className="space-y-2">
                      {benefits.map((benefit, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-md bg-primary/5 px-3 py-2 text-sm"
                        >
                          <span className="text-foreground">{benefit}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveBenefit(index)}
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
              <FormDescription>Add each benefit provided by the scheme</FormDescription>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        control={form.control}
        name="documentsRequired"
        render={({ field }) => {
          const documents: string[] = field.value || [];

          const handleAddDocument = () => {
            const input = document.getElementById('document-input') as HTMLInputElement;
            const value = input?.value?.trim();

            if (value && !documents.includes(value)) {
              field.onChange([...documents, value]);
              if (input) input.value = '';
            }
          };

          const handleRemoveDocument = (index: number) => {
            field.onChange(documents.filter((_, i) => i !== index));
          };

          const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddDocument();
            }
          };

          return (
            <FormItem>
              <FormLabel>Documents Required</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      id="document-input"
                      placeholder="e.g., Aadhar card"
                      onKeyDown={handleKeyPress}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddDocument}
                      className="shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {documents.length > 0 && (
                    <div className="space-y-2">
                      {documents.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-md bg-primary/5 px-3 py-2 text-sm"
                        >
                          <span className="text-foreground">{doc}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDocument(index)}
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
              <FormDescription>List all documents needed to apply for this scheme</FormDescription>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
}

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
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { X, Check, ChevronsUpDown } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { GovernmentSchemeFormData } from '@/lib/schemas/government-scheme';
import { MultiSelect } from '@/components/ui/multi-select';

const employmentStatusOptions = [
  { label: 'Student', value: 'student' },
  { label: 'Employee', value: 'employed' },
  { label: 'Self-Employed', value: 'self_employed' },
  { label: 'Unemployed', value: 'unemployed' },
  { label: 'Farmer', value: 'farmer' },
  { label: 'Laborer', value: 'laborer' },
  { label: 'Housewife', value: 'homemaker' },
  { label: 'Other', value: 'other' },
];

interface EligibilityCriteriaSectionProps {
  form: UseFormReturn<GovernmentSchemeFormData>;
}

export function EligibilityCriteriaSection({ form }: EligibilityCriteriaSectionProps) {
  // Helper for arrays
  const ArrayField = ({ fieldName, label, placeholder }: { fieldName: any, label: string, placeholder: string }) => (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => {
        const items: string[] = field.value || [];

        const handleAddItem = (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const value = e.currentTarget.value.trim();
            if (value && !items.includes(value)) {
              field.onChange([...items, value]);
            }
            e.currentTarget.value = '';
          }
        };

        const handleRemoveItem = (index: number) => {
          field.onChange(items.filter((_, i) => i !== index));
        };

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <Input
                  placeholder={placeholder}
                  onKeyDown={handleAddItem}
                />
                {items.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1 text-sm text-secondary-foreground"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="text-secondary-foreground/60 hover:text-secondary-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );

  return (
    <>
      {/* Age Criteria */}
      <AccordionItem value="age">
        <AccordionTrigger className="text-base font-semibold hover:no-underline">
          Age Criteria
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="eligibilityCriteria.age.min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Age</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 18"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="eligibilityCriteria.age.max"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Age</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 65"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Income Criteria */}
      <AccordionItem value="income">
        <AccordionTrigger className="text-base font-semibold hover:no-underline">
          Income Criteria (Annual)
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="eligibilityCriteria.income.min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Annual Income</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 50000"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="eligibilityCriteria.income.max"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Annual Income</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 500000"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Gender Criteria */}
      <AccordionItem value="gender">
        <AccordionTrigger className="text-base font-semibold hover:no-underline">
          Gender
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-4">
          <FormField
            control={form.control}
            name="eligibilityCriteria.gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender Requirement</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender requirement" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </AccordionContent>
      </AccordionItem>

      {/* Location Criteria */}
      <AccordionItem value="location">
        <AccordionTrigger className="text-base font-semibold hover:no-underline">
          Location Details
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-4">
          <FormField
            control={form.control}
            name="eligibilityCriteria.location.country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., India"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ArrayField fieldName="eligibilityCriteria.location.states" label="States" placeholder="Add state and press Enter" />
          <ArrayField fieldName="eligibilityCriteria.location.districts" label="Districts" placeholder="Add district and press Enter" />

          {/* Rural/Urban Toggle */}
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="eligibilityCriteria.location.ruralOnly"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
                  <FormLabel className="text-sm">Rural Only</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="eligibilityCriteria.location.urbanOnly"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
                  <FormLabel className="text-sm">Urban Only</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Social Criteria */}
      <AccordionItem value="social">
        <AccordionTrigger className="text-base font-semibold hover:no-underline">
          Social Details
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-4">
          <ArrayField fieldName="eligibilityCriteria.social.religion" label="Religion" placeholder="Add religion and press Enter" />
          <ArrayField fieldName="eligibilityCriteria.social.caste" label="Caste" placeholder="Add caste and press Enter" />

          {/* Toggles */}
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="eligibilityCriteria.social.minority"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
                  <FormLabel className="text-sm">Minority</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="eligibilityCriteria.social.disability"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
                  <FormLabel className="text-sm">Disability</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Employment Criteria */}
      <AccordionItem value="employment">
        <AccordionTrigger className="text-base font-semibold hover:no-underline">
          Employment Details
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-4">
          <ArrayField fieldName="eligibilityCriteria.employment.occupations" label="Occupations" placeholder="Add occupation and press Enter" />

          <FormField
            control={form.control}
            name="eligibilityCriteria.employment.employmentStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employment Status</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={employmentStatusOptions}
                    selected={field.value || []}
                    onChange={field.onChange}
                    placeholder="Select target employment groups..."
                  />
                </FormControl>
                <FormDescription>
                  Choose all groups that are eligible for this scheme
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </AccordionContent>
      </AccordionItem>
    </>
  );
}

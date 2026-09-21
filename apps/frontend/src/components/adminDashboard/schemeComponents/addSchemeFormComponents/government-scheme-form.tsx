'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GovernmentSchemeSchema, type GovernmentSchemeFormData } from '@/lib/schemas/government-scheme';
import { Button } from '@/components/ui/button';
import { BasicInfoSection } from './basic-info-section';
import { ClassificationSection } from './classification-section';
import { EligibilityCriteriaSection } from './eligibility-criteria-section';
import { BenefitsDocumentsSection } from './benefits-document-section';
import { ApplicationTrackingSection } from './application-tracking-section';
import { Accordion } from '@/components/ui/accordion';
import { Form } from '@/components/ui/form';

interface GovernmentSchemeFormProps {
  onSubmit?: (data: GovernmentSchemeFormData) => Promise<void>;
  defaultValues?: Partial<GovernmentSchemeFormData>;
  isEditMode?: boolean;
}

export function GovernmentSchemeForm({ onSubmit, defaultValues, isEditMode }: GovernmentSchemeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<GovernmentSchemeFormData>({
    resolver: zodResolver(GovernmentSchemeSchema),
    defaultValues: defaultValues || {
      title: '',
      description: '',
      ministry: '',
      category: '',
      tags: [],
      state: '',
      status: 'drafted',
      benefits: [],
      documentsRequired: [],
      eligibilityCriteria: {
        age: { min: undefined, max: undefined },
        income: { min: undefined, max: undefined },
        gender: 'any',
        location: {
          country: 'India',
          states: [],
          districts: [],
          ruralOnly: false,
          urbanOnly: false,
        },
        social: {
          religion: [],
          caste: [],
          minority: false,
          disability: false,
        },
        employment: {
          occupations: [],
          employmentStatus: [],
        },
      },
      applicationUrl: '',
      trackingMeta: {
        type: 'none',
        instructions: [],
      },
    } as any,
  });

  // Reset form when defaultValues changes (switching between add/edit or different schemes)
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    } else {
      form.reset({
        title: '',
        description: '',
        ministry: '',
        category: '',
        tags: [],
        state: '',
        status: 'drafted',
        benefits: [],
        documentsRequired: [],
        eligibilityCriteria: {
          age: { min: undefined, max: undefined },
          income: { min: undefined, max: undefined },
          gender: 'any',
          location: {
            country: 'India',
            states: [],
            districts: [],
            ruralOnly: false,
            urbanOnly: false,
          },
          social: {
            religion: [],
            caste: [],
            minority: false,
            disability: false,
          },
          employment: {
            occupations: [],
            employmentStatus: [],
          },
        },
        applicationUrl: '',
        trackingMeta: {
          type: 'none',
          instructions: [],
        },
      } as any);
    }
  }, [defaultValues, form.reset]);

  const onFormSubmit = async (value: GovernmentSchemeFormData) => {
    try {
      setSubmitError(null);
      setIsSubmitting(true);

      if (onSubmit) {
        await onSubmit(value);
      } else {
        console.log('Form data:', value);
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onFormSubmit)}
        className="space-y-8 w-full"
      >
        {/* Basic Information Section */}
        <BasicInfoSection form={form} />

        {/* Classification Section */}
        <ClassificationSection form={form} />

        {/* Eligibility Criteria Section - Collapsible */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Eligibility Criteria</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Define the eligibility criteria for this scheme
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <EligibilityCriteriaSection form={form} />
          </Accordion>
        </div>

        {/* Benefits & Documents Section */}
        <BenefitsDocumentsSection form={form} />

        {/* Application & Tracking Section */}
        <ApplicationTrackingSection form={form} />

        {/* Error Display */}
        {submitError && (
          <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
            {submitError}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-between border-t border-border pt-6">
          <div className="text-sm text-muted-foreground">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-32 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white border-0 shadow-lg"
            >
              {isSubmitting ? 'Submitting...' : isEditMode ? 'Update Scheme' : 'Submit Scheme'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

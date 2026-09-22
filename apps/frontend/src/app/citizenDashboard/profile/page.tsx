"use client";

import React, { useMemo } from "react";
import { Spinner } from "@/components/ui/spinner";
import { PersonalInformation } from "@/components/profilePage/personal-information";
import { AddressDetails } from "@/components/profilePage/address-details";
import { SocioEconomicDetails } from "@/components/profilePage/socio-economic-details";
import { EducationDetails } from "@/components/profilePage/education-details";
import { ProfessionalDetails } from "@/components/profilePage/professional-details";
import { AgricultureDetails } from "@/components/profilePage/agriculture-details";
import { SmartDocumentUpload } from "@/components/profilePage/smart-document-upload";
import { PassbookDetails } from "@/components/profilePage/passbook-details";
import { ProfileHeader } from "@/components/profilePage/profile-header";
import { ProfileSidebar } from "@/components/profilePage/profile-sidebar";
import { ProfileLayout } from "@/components/profilePage/profile-layout";
import { useProfile } from "@/hooks/useProfile";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import {
  User,
  MapPin,
  Wallet,
  BookOpen,
  Briefcase,
  Trees,
  FileText,
  Landmark,
} from "lucide-react";

const SECTIONS = [
  { id: "smart-document-upload", title: "Smart Documents", icon: FileText },
  { id: "personal", title: "Personal Info", icon: User },
  { id: "address", title: "Address", icon: MapPin },
  { id: "socio-economic", title: "Socio-Economic", icon: Wallet },
  { id: "education", title: "Education", icon: BookOpen },
  { id: "professional", title: "Professional", icon: Briefcase },
  { id: "agriculture", title: "Agriculture", icon: Trees, conditional: true },
  { id: "passbook", title: "Passbook", icon: Landmark },
];

export default function ProfilePage() {
  const {
    profile,
    documents,
    isLoading,
    updateField,
    saveSection,
    sectionSaving,
    isSaved,
    sectionCompletion,
    completionStats,
  } = useProfile();

  const sectionIds = useMemo(() => SECTIONS.map((s) => s.id), []);
  const { activeSection, scrollToSection } = useScrollSpy(sectionIds);

  const isFarmer = profile.occupationType === "farmer";

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-10 w-10 text-primary" />
          <p className="text-sm font-bold animate-pulse text-muted-foreground">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProfileLayout
      header={
        <ProfileHeader
          activeSection={activeSection}
          completionPercent={completionStats.percent}
        />
      }
      sidebar={
        <ProfileSidebar
          sections={SECTIONS}
          activeSection={activeSection}
          isFarmer={isFarmer}
          scrollToSection={scrollToSection}
        />
      }
    >
      <div id="smart-document-upload">
        <SmartDocumentUpload
          initialDocuments={documents}
          onDataExtracted={(extractedData) => {
            Object.entries(extractedData ?? {}).forEach(([field, value]) => {
              if (
                field in profile &&
                value !== null &&
                value !== undefined &&
                typeof value !== "object"
              ) {
                updateField(field as keyof typeof profile, String(value));
              }
            });
          }}
        />
      </div>

      <div id="personal">
        <PersonalInformation
          data={profile}
          onChange={updateField}
          onSave={() => saveSection("personalInformation")}
          isSaving={sectionSaving["personalInformation"]}
          isSaved={isSaved["personalInformation"]}
          completionPercent={sectionCompletion["personalInformation"]}
        />
      </div>

      <div id="address">
        <AddressDetails
          data={profile}
          onChange={updateField}
          onSave={() => saveSection("address")}
          isSaving={sectionSaving["address"]}
          isSaved={isSaved["address"]}
          completionPercent={sectionCompletion["address"]}
        />
      </div>

      <div id="socio-economic">
        <SocioEconomicDetails
          data={profile}
          onChange={updateField}
          onSave={() => saveSection("socioEconomic")}
          isSaving={sectionSaving["socioEconomic"]}
          isSaved={isSaved["socioEconomic"]}
          completionPercent={sectionCompletion["socioEconomic"]}
        />
      </div>

      <div id="education">
        <EducationDetails
          data={profile}
          onChange={updateField}
          onSave={() => saveSection("education")}
          isSaving={sectionSaving["education"]}
          isSaved={isSaved["education"]}
          completionPercent={sectionCompletion["education"]}
        />
      </div>

      <div id="professional">
        <ProfessionalDetails
          data={profile}
          onChange={updateField}
          onSave={() => saveSection("professional")}
          isSaving={sectionSaving["professional"]}
          isSaved={isSaved["professional"]}
          completionPercent={sectionCompletion["professional"]}
        />
      </div>

      {isFarmer && (
        <div id="agriculture">
          <AgricultureDetails
            data={{
              landSize: profile.landSize,
              cropType: Array.isArray(profile.cropType)
                ? profile.cropType[0]
                : profile.cropType || "",
              irrigationType: profile.irrigationType,
            }}
            onChange={updateField}
            onSave={() => saveSection("agriculture")}
            isSaving={sectionSaving["agriculture"]}
            isSaved={isSaved["agriculture"]}
            completionPercent={sectionCompletion["agriculture"]}
            isVisible={true}
          />
        </div>
      )}

      <div id="passbook">
        <PassbookDetails
          data={profile}
          onChange={(field, value) => updateField(field, value)}
          onSave={() => saveSection("passbook")}
          isSaving={sectionSaving.passbook}
          isSaved={isSaved.passbook}
          completionPercent={sectionCompletion.passbook}
        />
      </div>

      {/* <div className="pt-10 pb-10 text-center border-t border-border/20">
        <p className="text-xs text-muted-foreground font-medium">
          Data protected by 256-bit AES encryption.
        </p>
        <Link
          href="/privacy"
          className="mt-2 inline-block text-xs font-bold text-primary transition-colors hover:text-primary/80"
        >
          Privacy & Data Policy
        </Link>
      </div> */}
    </ProfileLayout>
  );
}

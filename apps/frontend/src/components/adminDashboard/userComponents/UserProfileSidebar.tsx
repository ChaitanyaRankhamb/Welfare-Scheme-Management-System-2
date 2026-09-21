import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { userAPI } from "@/components/api/userAPI";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Mail,
  Shield,
  Calendar,
  MapPin,
  IndianRupee,
  Briefcase,
  Info,
  Home,
  BookOpen,
  UserCircle,
  Phone,
  Globe,
  School,
  GraduationCap,
  Award,
  Trees,
  Sprout,
  Droplets,
  Landmark,
} from "lucide-react";
import { getUserId } from "./UserTable";

interface UserProfileSidebarProps {
  user: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserProfileSidebar = ({
  user,
  open,
  onOpenChange,
}: UserProfileSidebarProps) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && getUserId(user)) {
      const fetchProfile = async () => {
        try {
          setLoading(true);
          const res = await userAPI.getUserProfile(getUserId(user));
          if (res.success) {
            setProfile(res.data);
          }
        } catch (error) {
          console.error("Failed to fetch profile", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [open, user?._id]);

  if (!user) return null;

  const ProfileField = ({ icon: Icon, label, value, className = "" }: any) => {
    const displayValue =
      value === true ? "Yes" : value === false ? "No" : value;
    const isNotProvided =
      displayValue === null ||
      displayValue === undefined ||
      displayValue === "" ||
      (typeof displayValue === "string" && displayValue.trim() === "");

    return (
      <div
        className={`p-3 rounded-xl bg-muted/80 dark:bg-card/5 border border-border dark:border-border/5 flex flex-col gap-1 transition-all hover:border-primary/20 hover:bg-card dark:hover:bg-card/10 ${className}`}
      >
        <div className="flex items-center gap-2 text-muted-foreground/80">
          <Icon className="w-3 h-3" />
          <span className="text-[9px] font-bold uppercase tracking-widest leading-none">
            {label}
          </span>
        </div>
        <div className="text-[13px] font-semibold text-muted-foreground dark:text-muted-foreground truncate">
          {isNotProvided ? (
            <span className="text-muted-foreground font-normal italic text-xs">
              Not provided
            </span>
          ) : (
            displayValue
          )}
        </div>
      </div>
    );
  };

  const SectionHeader = ({ icon: Icon, title, colorClass }: any) => (
    <div className={`flex items-center gap-2 px-2 ${colorClass} mt-8 mb-4`}>
      <div
        className={`p-1.5 rounded-lg ${colorClass.replace("text-", "bg-")}/10`}
      >
        <Icon className="w-3.5 h-3.5" />
      </div>
      <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">
        {title}
      </h3>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md border-l border-border dark:border-border/10 bg-card/95 dark:bg-card/95 backdrop-blur-xl p-0">
        <ScrollArea className="h-full">
          <div className="p-6 pb-20">
            <SheetHeader className="mb-8">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold border-4 border-border dark:border-border shadow-xl">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <SheetTitle className="text-2xl font-bold">
                    {profile
                      ? `${profile.firstName} ${profile.lastName}`
                      : user.username}
                  </SheetTitle>
                  <SheetDescription className="flex items-center justify-center gap-2 mt-1">
                    <Mail className="w-3 h-3" />
                    {user.email}
                  </SheetDescription>
                </div>
                <Badge
                  variant={user.isActive ? "default" : "destructive"}
                  className="px-4 py-1 rounded-full uppercase text-[10px] font-bold tracking-widest font-mono"
                >
                  {user.isActive ? "Active Account" : "Suspended"}
                </Badge>
              </div>
            </SheetHeader>

            {loading ? (
              <div className="space-y-6">
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-40 w-full rounded-2xl" />
                <Skeleton className="h-40 w-full rounded-2xl" />
              </div>
            ) : profile ? (
              <div className="space-y-6">
                <div className="space-y-2 pb-10">
                  {/* Personal Information */}
                  <SectionHeader
                    icon={UserCircle}
                    title="Personal Information"
                    colorClass="text-primary"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <ProfileField
                      icon={User}
                      label="First Name"
                      value={profile.firstName}
                    />
                    <ProfileField
                      icon={User}
                      label="Last Name"
                      value={profile.lastName}
                    />
                    <ProfileField
                      icon={User}
                      label="Middle Name"
                      value={profile.middleName}
                    />
                    <ProfileField
                      icon={UserCircle}
                      label="Gender"
                      value={profile.gender}
                    />
                    <ProfileField
                      icon={Calendar}
                      label="DOB"
                      value={
                        profile.dateOfBirth
                          ? new Date(profile.dateOfBirth).toLocaleDateString()
                          : null
                      }
                    />
                    <ProfileField
                      icon={Phone}
                      label="Mobile"
                      value={profile.mobileNumber}
                    />
                    <ProfileField
                      icon={Phone}
                      label="Alt. Contact"
                      value={profile.alternateContact}
                    />
                  </div>

                  {/* Address Details */}
                  <SectionHeader
                    icon={Home}
                    title="Address Details"
                    colorClass="text-primary"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <ProfileField
                      icon={Globe}
                      label="Country"
                      value={profile.country}
                    />
                    <ProfileField
                      icon={MapPin}
                      label="State"
                      value={profile.state}
                    />
                    <ProfileField
                      icon={MapPin}
                      label="District"
                      value={profile.district}
                    />
                    <ProfileField
                      icon={MapPin}
                      label="Taluka"
                      value={profile.taluka}
                    />
                    <ProfileField
                      icon={MapPin}
                      label="Village"
                      value={profile.village}
                    />
                    <ProfileField
                      icon={MapPin}
                      label="Pincode"
                      value={profile.pincode}
                    />
                    <ProfileField
                      icon={MapPin}
                      label="Area Type"
                      value={profile.areaType}
                      className="col-span-2"
                    />
                  </div>

                  {/* Socio-Economic Details */}
                  <SectionHeader
                    icon={IndianRupee}
                    title="Socio-Economic"
                    colorClass="text-primary"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <ProfileField
                      icon={IndianRupee}
                      label="Annual Income"
                      value={
                        profile.annualIncome ? `₹${profile.annualIncome}` : null
                      }
                    />
                    <ProfileField
                      icon={Info}
                      label="Income Category"
                      value={profile.incomeCategory}
                    />
                    <ProfileField
                      icon={Shield}
                      label="BPL Status"
                      value={profile.bplStatus}
                    />
                    <ProfileField
                      icon={Info}
                      label="Caste"
                      value={profile.casteCategory}
                    />
                    <ProfileField
                      icon={Shield}
                      label="Religion"
                      value={profile.religion}
                    />
                    <ProfileField
                      icon={Info}
                      label="Ration Card"
                      value={profile.rationCardType}
                    />
                  </div>

                  {/* Education Details */}
                  <SectionHeader
                    icon={BookOpen}
                    title="Education Details"
                    colorClass="text-destructive"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <ProfileField
                      icon={BookOpen}
                      label="Education Level"
                      value={profile.educationLevel}
                      className="col-span-2"
                    />
                    <ProfileField
                      icon={School}
                      label="Institution"
                      value={profile.institutionName}
                      className="col-span-2"
                    />
                    <ProfileField
                      icon={BookOpen}
                      label="Course"
                      value={profile.course}
                    />
                    <ProfileField
                      icon={BookOpen}
                      label="Stream"
                      value={profile.stream}
                    />
                    <ProfileField
                      icon={Landmark}
                      label="Board/Uni"
                      value={profile.boardUniversity}
                      className="col-span-2"
                    />
                    <ProfileField
                      icon={Calendar}
                      label="Admission Year"
                      value={profile.admissionYear}
                    />
                    <ProfileField
                      icon={Calendar}
                      label="Passing Year"
                      value={profile.passingYear}
                    />
                    <ProfileField
                      icon={Award}
                      label="Result Type"
                      value={profile.resultType}
                    />
                    <ProfileField
                      icon={Award}
                      label="Result Value"
                      value={profile.resultValue}
                    />
                    <ProfileField
                      icon={User}
                      label="Mode"
                      value={profile.educationMode}
                    />
                  </div>

                  {/* Professional Details */}
                  <SectionHeader
                    icon={Briefcase}
                    title="Professional"
                    colorClass="text-primary"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <ProfileField
                      icon={Briefcase}
                      label="Occupation"
                      value={profile.occupationType}
                      className="col-span-2"
                    />
                    <ProfileField
                      icon={Shield}
                      label="Employment Status"
                      value={profile.employmentStatus}
                    />
                    <ProfileField
                      icon={Award}
                      label="Labor Type"
                      value={profile.laborType}
                    />
                    <ProfileField
                      icon={Award}
                      label="Skill Level"
                      value={profile.skillLevel}
                    />
                    <ProfileField
                      icon={Calendar}
                      label="Experience"
                      value={
                        profile.yearsOfExperience
                          ? `${profile.yearsOfExperience} Years`
                          : null
                      }
                    />
                  </div>

                  {/* Agriculture Details (Conditional) */}
                  {profile.occupationType === "farmer" && (
                    <>
                      <SectionHeader
                        icon={Trees}
                        title="Agriculture"
                        colorClass="text-primary"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <ProfileField
                          icon={MapPin}
                          label="Land Size"
                          value={profile.landSize}
                        />
                        <ProfileField
                          icon={Sprout}
                          label="Crop Type"
                          value={profile.cropType}
                        />
                        <ProfileField
                          icon={Droplets}
                          label="Irrigation"
                          value={profile.irrigationType}
                          className="col-span-2"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center bg-muted dark:bg-card/5 rounded-3xl border border-dashed border-border dark:border-border/10 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-card dark:bg-card rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <Info className="w-8 h-8 text-muted-foreground opacity-50" />
                </div>
                <h3 className="font-bold text-muted-foreground dark:text-primary-foreground text-lg">
                  No Profile Data
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs mt-2 italic font-medium">
                  "User has not updated their profile yet."
                </p>
              </div>
            )}

            <div className="mt-12 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary font-bold text-xs uppercase tracking-tighter">
                Note
              </div>
              <p className="text-[11px] text-primary/70 leading-relaxed font-semibold">
                This data is fetched directly from the citizen profile records
                for verification purposes.
              </p>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

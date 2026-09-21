import type { SchemeId } from './schemeId';

// ─── Sub-types ───────────────────────────────────────────────────────────────

export type EmploymentStatus =
  | 'student'
  | 'employed'
  | 'self_employed'
  | 'unemployed'
  | 'farmer'
  | 'laborer'
  | 'homemaker'
  | 'other';

export type SchemeGender = 'male' | 'female' | 'other' | 'any';

export interface AgeCriteria {
  min: number;
  max: number;
}

export interface IncomeCriteria {
  min: number;
  max: number;
}

export interface LocationCriteria {
  country: string;
  states: string[];
  districts: string[];
  ruralOnly: boolean;
  urbanOnly: boolean;
}

export interface SocialCriteria {
  religion: string[];
  caste: string[];
  minority: boolean;
  disability: boolean;
}

export interface EmploymentCriteria {
  employmentStatus: EmploymentStatus[];
  occupations: string[];
}

export interface SchemeEligibilityCriteria {
  age: AgeCriteria;
  income: IncomeCriteria;
  gender: SchemeGender;
  location: LocationCriteria;
  social: SocialCriteria;
  employment: EmploymentCriteria;
}

// ─── Supporting Types ─────────────────────────────────────────────────────────

export type TrackingMeta = {
  type: 'direct' | 'multi_step' | 'login_required' | 'none';
  instructions?: string[];
};

export type SchemeStatus = 'drafted' | 'published' | 'archived';

// ─── Scheme Entity ────────────────────────────────────────────────────────────

export class Scheme {
  private eligibility: SchemeEligibilityCriteria;

  constructor(
    public readonly id: SchemeId,
    private title: string,
    private description: string,
    private ministry: string,
    private category: string,
    private tags: string[],
    rawEligibility: Partial<SchemeEligibilityCriteria>,
    private benefits: string[],
    private documentsRequired: string[],
    private applicationUrl: string | undefined,
    private trackingMeta: TrackingMeta | undefined,
    private status: SchemeStatus,
    public readonly createdAt: Date,
    private updatedAt: Date
  ) {
    this.eligibility = this.normalizeEligibility(rawEligibility);
    this.validate(this.eligibility);
  }

  // ─── Normalization ──────────────────────────────────────────────────────────

  private normalizeEligibility(
    input: Partial<SchemeEligibilityCriteria>
  ): SchemeEligibilityCriteria {
    const age = input.age ?? { min: 0, max: 150 };
    const income = input.income ?? { min: 0, max: 99999999 };
    const location = input.location ?? {
      country: 'India',
      states: [],
      districts: [],
      ruralOnly: false,
      urbanOnly: false,
    };
    const social = input.social ?? {
      religion: [],
      caste: [],
      minority: false,
      disability: false,
    };
    const employment = input.employment ?? {
      employmentStatus: [],
      occupations: [],
    };

    return {
      age: {
        min: age.min ?? 0,
        max: age.max ?? 150,
      },
      income: {
        min: income.min ?? 0,
        max: income.max ?? 99999999,
      },
      gender: input.gender ?? 'any',
      location: {
        country: location.country ?? 'India',
        states: location.states ?? [],
        districts: location.districts ?? [],
        ruralOnly: location.ruralOnly ?? false,
        urbanOnly: location.urbanOnly ?? false,
      },
      social: {
        religion: social.religion ?? [],
        caste: social.caste ?? [],
        minority: social.minority ?? false,
        disability: social.disability ?? false,
      },
      employment: {
        employmentStatus: employment.employmentStatus ?? [],
        occupations: employment.occupations ?? [],
      },
    };
  }

  // ─── Validation ─────────────────────────────────────────────────────────────

  private validate(e: SchemeEligibilityCriteria): void {
    if (!e.employment.employmentStatus.length) {
      throw new Error(
        `Scheme "${this.title}" must define at least one employmentStatus.`
      );
    }

    const validStatuses: EmploymentStatus[] = [
      'student', 'employed', 'self_employed', 'unemployed',
      'farmer', 'laborer', 'homemaker', 'other',
    ];
    for (const status of e.employment.employmentStatus) {
      if (!validStatuses.includes(status)) {
        throw new Error(`Scheme "${this.title}": invalid employmentStatus "${status}".`);
      }
    }

    if (e.age.min > e.age.max) {
      throw new Error(
        `Scheme "${this.title}": age.min (${e.age.min}) must be <= age.max (${e.age.max}).`
      );
    }

    if (e.income.min > e.income.max) {
      throw new Error(
        `Scheme "${this.title}": income.min (${e.income.min}) must be <= income.max (${e.income.max}).`
      );
    }

    if (e.location.ruralOnly && e.location.urbanOnly) {
      throw new Error(
        `Scheme "${this.title}": ruralOnly and urbanOnly cannot both be true.`
      );
    }

    const validGenders: SchemeGender[] = ['male', 'female', 'other', 'any'];
    if (!validGenders.includes(e.gender)) {
      throw new Error(
        `Scheme "${this.title}": invalid gender "${e.gender}".`
      );
    }
  }

  // ─── Eligibility Getters ────────────────────────────────────────────────────

  getEligibility(): Readonly<SchemeEligibilityCriteria> {
    return this.eligibility;
  }

  getMinAge(): number {
    return this.eligibility.age.min;
  }

  getMaxAge(): number {
    return this.eligibility.age.max;
  }

  getMinIncome(): number {
    return this.eligibility.income.min;
  }

  getMaxIncome(): number {
    return this.eligibility.income.max;
  }

  getGender(): SchemeGender {
    return this.eligibility.gender;
  }

  getLocation(): Readonly<LocationCriteria> {
    return this.eligibility.location;
  }

  getSocial(): Readonly<SocialCriteria> {
    return this.eligibility.social;
  }

  getEmploymentStatus(): EmploymentStatus[] {
    return [...this.eligibility.employment.employmentStatus];
  }

  getOccupations(): string[] {
    return [...this.eligibility.employment.occupations];
  }

  // ─── Field Getters ──────────────────────────────────────────────────────────

  getTitle(): string { return this.title; }
  getDescription(): string { return this.description; }
  getMinistry(): string { return this.ministry; }
  getCategory(): string { return this.category; }
  getTags(): string[] { return [...this.tags]; }
  getBenefits(): string[] { return [...this.benefits]; }
  getDocumentsRequired(): string[] { return [...this.documentsRequired]; }
  getApplicationUrl(): string | undefined { return this.applicationUrl; }
  getStatus(): SchemeStatus { return this.status; }
  getUpdatedAt(): Date { return this.updatedAt; }

  getTrackingMeta(): TrackingMeta | undefined {
    return this.trackingMeta
      ? {
          ...this.trackingMeta,
          instructions: this.trackingMeta.instructions
            ? [...this.trackingMeta.instructions]
            : undefined,
        }
      : undefined;
  }

  // ─── Mutations ──────────────────────────────────────────────────────────────

  updateDetails(partial: {
    title?: string;
    description?: string;
    ministry?: string;
    category?: string;
    tags?: string[];
    eligibility?: Partial<SchemeEligibilityCriteria>;
    benefits?: string[];
    documentsRequired?: string[];
    applicationUrl?: string;
    trackingMeta?: TrackingMeta;
    status?: SchemeStatus;
  }): void {
    if (partial.title !== undefined) this.title = partial.title;
    if (partial.description !== undefined) this.description = partial.description;
    if (partial.ministry !== undefined) this.ministry = partial.ministry;
    if (partial.category !== undefined) this.category = partial.category;
    if (partial.tags !== undefined) this.tags = [...partial.tags];

    if (partial.eligibility !== undefined) {
      const normalized = this.normalizeEligibility({
        ...this.eligibility,
        ...partial.eligibility,
      });
      this.validate(normalized);
      this.eligibility = normalized;
    }

    if (partial.benefits !== undefined) this.benefits = [...partial.benefits];
    if (partial.documentsRequired !== undefined) this.documentsRequired = [...partial.documentsRequired];
    if (partial.applicationUrl !== undefined) this.applicationUrl = partial.applicationUrl;
    if (partial.trackingMeta !== undefined) {
      this.trackingMeta = {
        ...partial.trackingMeta,
        instructions: partial.trackingMeta.instructions
          ? [...partial.trackingMeta.instructions]
          : undefined,
      };
    }
    if (partial.status !== undefined) this.status = partial.status;
    this.touch();
  }

  setStatus(status: SchemeStatus): void {
    this.status = status;
    this.touch();
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}

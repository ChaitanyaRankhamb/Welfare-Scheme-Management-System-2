"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scheme = void 0;
// ─── Scheme Entity ────────────────────────────────────────────────────────────
class Scheme {
    id;
    title;
    description;
    ministry;
    category;
    tags;
    benefits;
    documentsRequired;
    applicationUrl;
    trackingMeta;
    status;
    createdAt;
    updatedAt;
    eligibility;
    constructor(id, title, description, ministry, category, tags, rawEligibility, benefits, documentsRequired, applicationUrl, trackingMeta, status, createdAt, updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.ministry = ministry;
        this.category = category;
        this.tags = tags;
        this.benefits = benefits;
        this.documentsRequired = documentsRequired;
        this.applicationUrl = applicationUrl;
        this.trackingMeta = trackingMeta;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.eligibility = this.normalizeEligibility(rawEligibility);
        this.validate(this.eligibility);
    }
    // ─── Normalization ──────────────────────────────────────────────────────────
    normalizeEligibility(input) {
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
    validate(e) {
        if (!e.employment.employmentStatus.length) {
            throw new Error(`Scheme "${this.title}" must define at least one employmentStatus.`);
        }
        const validStatuses = [
            'student', 'employed', 'self_employed', 'unemployed',
            'farmer', 'laborer', 'homemaker', 'other',
        ];
        for (const status of e.employment.employmentStatus) {
            if (!validStatuses.includes(status)) {
                throw new Error(`Scheme "${this.title}": invalid employmentStatus "${status}".`);
            }
        }
        if (e.age.min > e.age.max) {
            throw new Error(`Scheme "${this.title}": age.min (${e.age.min}) must be <= age.max (${e.age.max}).`);
        }
        if (e.income.min > e.income.max) {
            throw new Error(`Scheme "${this.title}": income.min (${e.income.min}) must be <= income.max (${e.income.max}).`);
        }
        if (e.location.ruralOnly && e.location.urbanOnly) {
            throw new Error(`Scheme "${this.title}": ruralOnly and urbanOnly cannot both be true.`);
        }
        const validGenders = ['male', 'female', 'other', 'any'];
        if (!validGenders.includes(e.gender)) {
            throw new Error(`Scheme "${this.title}": invalid gender "${e.gender}".`);
        }
    }
    // ─── Eligibility Getters ────────────────────────────────────────────────────
    getEligibility() {
        return this.eligibility;
    }
    getMinAge() {
        return this.eligibility.age.min;
    }
    getMaxAge() {
        return this.eligibility.age.max;
    }
    getMinIncome() {
        return this.eligibility.income.min;
    }
    getMaxIncome() {
        return this.eligibility.income.max;
    }
    getGender() {
        return this.eligibility.gender;
    }
    getLocation() {
        return this.eligibility.location;
    }
    getSocial() {
        return this.eligibility.social;
    }
    getEmploymentStatus() {
        return [...this.eligibility.employment.employmentStatus];
    }
    getOccupations() {
        return [...this.eligibility.employment.occupations];
    }
    // ─── Field Getters ──────────────────────────────────────────────────────────
    getTitle() { return this.title; }
    getDescription() { return this.description; }
    getMinistry() { return this.ministry; }
    getCategory() { return this.category; }
    getTags() { return [...this.tags]; }
    getBenefits() { return [...this.benefits]; }
    getDocumentsRequired() { return [...this.documentsRequired]; }
    getApplicationUrl() { return this.applicationUrl; }
    getStatus() { return this.status; }
    getUpdatedAt() { return this.updatedAt; }
    getTrackingMeta() {
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
    updateDetails(partial) {
        if (partial.title !== undefined)
            this.title = partial.title;
        if (partial.description !== undefined)
            this.description = partial.description;
        if (partial.ministry !== undefined)
            this.ministry = partial.ministry;
        if (partial.category !== undefined)
            this.category = partial.category;
        if (partial.tags !== undefined)
            this.tags = [...partial.tags];
        if (partial.eligibility !== undefined) {
            const normalized = this.normalizeEligibility({
                ...this.eligibility,
                ...partial.eligibility,
            });
            this.validate(normalized);
            this.eligibility = normalized;
        }
        if (partial.benefits !== undefined)
            this.benefits = [...partial.benefits];
        if (partial.documentsRequired !== undefined)
            this.documentsRequired = [...partial.documentsRequired];
        if (partial.applicationUrl !== undefined)
            this.applicationUrl = partial.applicationUrl;
        if (partial.trackingMeta !== undefined) {
            this.trackingMeta = {
                ...partial.trackingMeta,
                instructions: partial.trackingMeta.instructions
                    ? [...partial.trackingMeta.instructions]
                    : undefined,
            };
        }
        if (partial.status !== undefined)
            this.status = partial.status;
        this.touch();
    }
    setStatus(status) {
        this.status = status;
        this.touch();
    }
    touch() {
        this.updatedAt = new Date();
    }
}
exports.Scheme = Scheme;

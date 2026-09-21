"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
class Profile {
    id;
    snapshot;
    createdAt;
    updatedAt;
    constructor(id, snapshot, createdAt, updatedAt) {
        this.id = id;
        this.snapshot = snapshot;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    getUserId() {
        return this.snapshot.userId;
    }
    getSnapshot() {
        return this.snapshot;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }
    /**
     * Calculates age from date of birth
     */
    getAge() {
        const today = new Date();
        const dob = this.snapshot.dateOfBirth;
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    }
    getGender() {
        return this.snapshot.gender;
    }
    getAnnualIncome() {
        return this.snapshot.annualIncome;
    }
    getEmploymentStatus() {
        return this.snapshot.employmentStatus;
    }
    getCasteCategory() {
        return this.snapshot.casteCategory;
    }
    getReligion() {
        return this.snapshot.religion;
    }
    getLocation() {
        return {
            country: this.snapshot.country,
            state: this.snapshot.state,
            district: this.snapshot.district,
            taluka: this.snapshot.taluka,
            village: this.snapshot.village,
            ruralOrUrban: this.snapshot.areaType === 'RURAL' ? 'rural' : 'urban'
        };
    }
    /**
     * Partial update; recalculates completion percentage after merge.
     */
    patch(partial) {
        const cleanPartial = Object.fromEntries(Object.entries(partial).filter(([_, v]) => v !== undefined));
        const merged = {
            ...this.snapshot,
            ...cleanPartial,
            cropType: cleanPartial.cropType ? [...cleanPartial.cropType] : (this.snapshot.cropType ? [...this.snapshot.cropType] : undefined)
        };
        this.snapshot = merged;
        this.recalculateCompletion();
        this.touch();
    }
    /**
     * Recalculates the profile completion percentage based on filled fields.
     */
    recalculateCompletion() {
        let totalScore = 0;
        // 1. Personal Info (20%) - 5 core fields: firstName, lastName, gender, dob, mobile
        const personalFields = ['firstName', 'lastName', 'gender', 'dateOfBirth', 'mobileNumber'];
        totalScore += this.calculateSectionScore(personalFields, 20);
        // 2. Address (20%) - 6 core fields
        const addressFields = ['country', 'state', 'district', 'taluka', 'village', 'pincode', 'areaType'];
        totalScore += this.calculateSectionScore(addressFields, 20);
        // 3. Socio-Economic (20%) - 4 fields: annualIncome, casteCategory, religion, bplStatus (boolean is always there)
        const socioFields = ['annualIncome', 'casteCategory', 'religion', 'bplStatus'];
        totalScore += this.calculateSectionScore(socioFields, 20);
        // 4. Education (10%) - 9 fields
        const educationFields = [
            'educationLevel', 'institutionName', 'course', 'stream',
            'boardUniversity', 'admissionYear', 'passingYear',
            'resultType', 'resultValue', 'educationMode'
        ];
        totalScore += this.calculateSectionScore(educationFields, 10);
        // 5. Professional (15%) - occ, status, labor, skill, exp
        const professionalFields = ['occupationType', 'employmentStatus', 'laborType', 'skillLevel', 'yearsOfExperience'];
        totalScore += this.calculateSectionScore(professionalFields, 15);
        // 6. Agriculture (15%) - size, crops, irrigation
        const agricultureFields = ['landSize', 'cropType', 'irrigationType'];
        totalScore += this.calculateSectionScore(agricultureFields, 15);
        this.snapshot.profileCompletionPercentage = Math.round(totalScore);
    }
    calculateSectionScore(fields, weight) {
        if (fields.length === 0)
            return 0;
        let filled = 0;
        for (const field of fields) {
            const val = this.snapshot[field];
            if (val !== undefined && val !== null && val !== '') {
                if (Array.isArray(val) && val.length === 0)
                    continue;
                filled++;
            }
        }
        return (filled / fields.length) * weight;
    }
    touch() {
        this.updatedAt = new Date();
    }
}
exports.Profile = Profile;

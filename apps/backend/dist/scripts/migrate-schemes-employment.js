"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const scheme_model_1 = require("../database/mongo/models/scheme.model");
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
async function migrate() {
    try {
        console.log('Connecting to MongoDB...');
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/welfare';
        await mongoose_1.default.connect(mongoUri);
        console.log('Connected.');
        const schemes = await scheme_model_1.SchemeModel.find({});
        console.log(`Found ${schemes.length} schemes to check.`);
        let updatedCount = 0;
        for (const scheme of schemes) {
            // @ts-ignore - access raw source if necessary, but we can check eligibilityCriteria
            const criteria = scheme.eligibilityCriteria || {};
            // If employmentStatus already exists and is an array with items, skip
            if (criteria.employment && Array.isArray(criteria.employment.employmentStatus) && criteria.employment.employmentStatus.length > 0) {
                continue;
            }
            const inferred = inferEmploymentFromScheme(scheme);
            if (!criteria.employment) {
                criteria.employment = { employmentStatus: inferred };
            }
            else {
                criteria.employment.employmentStatus = inferred;
            }
            scheme.eligibilityCriteria = criteria;
            // Mark as modified if using mixed types or if mongoose doesn't detect it
            scheme.markModified('eligibilityCriteria');
            await scheme.save();
            updatedCount++;
            console.log(`Updated scheme: ${scheme.title} -> ${inferred.join(', ')}`);
        }
        console.log(`Migration complete. Updated ${updatedCount} schemes.`);
        process.exit(0);
    }
    catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}
function inferEmploymentFromScheme(scheme) {
    const tags = (scheme.tags || []).map((t) => t.toLowerCase());
    const category = (scheme.category || '').toLowerCase();
    const title = (scheme.title || '').toLowerCase();
    const results = [];
    if (tags.includes('student') || category.includes('education') || title.includes('scholarship') || title.includes('student')) {
        results.push('student');
    }
    if (tags.includes('farmer') || category.includes('agriculture') || title.includes('kisan') || title.includes('farmer')) {
        results.push('farmer');
    }
    if (tags.includes('labor') || tags.includes('worker') || title.includes('laborer') || title.includes('worker')) {
        results.push('laborer');
    }
    if (tags.includes('job') || category.includes('employment') || title.includes('employment')) {
        results.push('unemployed');
        results.push('laborer');
    }
    if (category.includes('business') || category.includes('entrepreneur')) {
        results.push('self_employed');
    }
    if (category.includes('women') || title.includes('widow') || title.includes('women')) {
        results.push('homemaker');
    }
    // Deduplicate and fallback
    const uniqueResults = Array.from(new Set(results));
    return uniqueResults.length > 0 ? uniqueResults : ['other'];
}
migrate();

"use strict";
/**
 * Migration Script: Scheme Module Refactor
 *
 * Transforms all existing scheme documents in MongoDB from:
 *   - Old schema: { state, eligibilityCriteria: { age?, income?, gender?, location?, social?, employment } }
 *
 * To:
 *   - New schema: { eligibility: { age, income, gender, location, social, employment } }
 *
 * Run: npx ts-node src/scripts/migrate-schemes.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', '..', '.env') });
const mongodb_connection_1 = __importDefault(require("../config/mongodb.connection"));
// ─── Helpers ──────────────────────────────────────────────────────────────────
function normalizeEligibility(old, state) {
    const ec = old?.eligibilityCriteria ?? old?.eligibility ?? {};
    const oldLocation = ec.location ?? {};
    // Merge the old top-level `state` field into location.states
    const states = Array.isArray(oldLocation.states)
        ? oldLocation.states
        : [];
    if (state && state.toLowerCase() !== 'all india' && !states.includes(state)) {
        states.push(state);
    }
    return {
        age: {
            min: ec.age?.min ?? 0,
            max: ec.age?.max ?? 150,
        },
        income: {
            min: ec.income?.min ?? 0,
            max: ec.income?.max ?? 99999999,
        },
        gender: ec.gender ?? 'any',
        location: {
            country: oldLocation.country ?? 'India',
            states,
            districts: oldLocation.districts ?? [],
            ruralOnly: oldLocation.ruralOnly ?? false,
            urbanOnly: oldLocation.urbanOnly ?? false,
        },
        social: {
            religion: ec.social?.religion ?? [],
            caste: ec.social?.caste ?? [],
            minority: ec.social?.minority ?? false,
            disability: ec.social?.disability ?? false,
        },
        employment: {
            employmentStatus: ec.employment?.employmentStatus ?? [],
            occupations: ec.employment?.occupations ?? [],
        },
    };
}
// ─── Migration ────────────────────────────────────────────────────────────────
const migrate = async () => {
    try {
        console.log('🔗 Connecting to database...');
        await (0, mongodb_connection_1.default)();
        const db = mongoose_1.default.connection.db;
        if (!db)
            throw new Error('No database connection established.');
        const collection = db.collection('schemes');
        const allDocs = await collection.find({}).toArray();
        console.log(`📄 Found ${allDocs.length} scheme documents to migrate.`);
        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;
        for (const doc of allDocs) {
            try {
                // Skip if already migrated
                if (doc.eligibility && !doc.eligibilityCriteria) {
                    console.log(`  ⏭ Skipping already migrated: "${doc.title}"`);
                    skipCount++;
                    continue;
                }
                const newEligibility = normalizeEligibility(doc, doc.state);
                // Validate critical field
                if (!newEligibility.employment.employmentStatus.length) {
                    console.warn(`  ⚠ Skipping "${doc.title}" — empty employmentStatus after migration.`);
                    skipCount++;
                    continue;
                }
                await collection.updateOne({ _id: doc._id }, {
                    $set: { eligibility: newEligibility },
                    $unset: { eligibilityCriteria: '', state: '' },
                });
                console.log(`  ✅ Migrated: "${doc.title}"`);
                successCount++;
            }
            catch (err) {
                console.error(`  ❌ Error migrating "${doc.title}":`, err);
                errorCount++;
            }
        }
        console.log('\n📊 Migration Summary:');
        console.log(`   ✅ Migrated:  ${successCount}`);
        console.log(`   ⏭ Skipped:   ${skipCount}`);
        console.log(`   ❌ Errors:    ${errorCount}`);
        console.log(`   📦 Total:     ${allDocs.length}`);
    }
    catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
    finally {
        if (mongoose_1.default.connection.readyState === 1) {
            await mongoose_1.default.disconnect();
            console.log('\n🔌 Disconnected from database.');
        }
        process.exit(0);
    }
};
migrate();

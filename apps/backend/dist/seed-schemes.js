"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
// Load .env from backend root
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', '.env') });
const mongodb_connection_1 = __importDefault(require("./config/mongodb.connection"));
const scheme_model_1 = require("./database/mongo/models/scheme.model");
const seedSchemes = async () => {
    try {
        console.log('Connecting to database...');
        await (0, mongodb_connection_1.default)();
        console.log('Reading schemes data from JSON file...');
        const dataPath = path_1.default.join(__dirname, 'data', 'schemes.data.json');
        const rawData = fs_1.default.readFileSync(dataPath, 'utf-8');
        const schemesData = JSON.parse(rawData);
        console.log(`Found ${schemesData.length} schemes to insert.`);
        console.log('Clearing old schemes from the collection...');
        await scheme_model_1.SchemeModel.deleteMany({});
        console.log('Inserting new schemes...');
        await scheme_model_1.SchemeModel.insertMany(schemesData);
        console.log('✔️ Successfully seeded schemes into the database.');
    }
    catch (error) {
        console.error('❌ Failed to seed schemes:', error);
    }
    finally {
        if (mongoose_1.default.connection.readyState === 1) {
            await mongoose_1.default.disconnect();
            console.log('Disconnected from database.');
        }
        process.exit(0);
    }
};
seedSchemes();

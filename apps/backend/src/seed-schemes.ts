import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load .env from backend root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import connectDB from './config/mongodb.connection';
import { SchemeModel } from './database/mongo/models/scheme.model';

const seedSchemes = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    
    console.log('Reading schemes data from JSON file...');
    const dataPath = path.join(__dirname, 'data', 'schemes.data.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const schemesData = JSON.parse(rawData);
    
    console.log(`Found ${schemesData.length} schemes to insert.`);
    
    console.log('Clearing old schemes from the collection...');
    await SchemeModel.deleteMany({});
    
    console.log('Inserting new schemes...');
    await SchemeModel.insertMany(schemesData);
    
    console.log('✔️ Successfully seeded schemes into the database.');
  } catch (error) {
    console.error('❌ Failed to seed schemes:', error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('Disconnected from database.');
    }
    process.exit(0);
  }
};

seedSchemes();

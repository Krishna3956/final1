#!/usr/bin/env node

/**
 * Supabase Migration Script
 * Migrates all data from old Supabase project to new one
 * 
 * Usage:
 * node migrate-supabase.js <old-url> <old-key> <new-url> <new-key>
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const args = process.argv.slice(2);

if (args.length < 4) {
  console.error('Usage: node migrate-supabase.js <old-url> <old-key> <new-url> <new-key>');
  console.error('\nExample:');
  console.error('node migrate-supabase.js https://old.supabase.co old_key https://new.supabase.co new_key');
  process.exit(1);
}

const [oldUrl, oldKey, newUrl, newKey] = args;

console.log('🔄 Starting Supabase migration...\n');

// Create clients
const oldSupabase = createClient(oldUrl, oldKey);
const newSupabase = createClient(newUrl, newKey);

async function migrate() {
  try {
    // Step 1: Fetch all data from old project
    console.log('📥 Fetching data from old project...');
    const { data: tools, error: fetchError } = await oldSupabase
      .from('mcp_tools')
      .select('*');

    if (fetchError) {
      throw new Error(`Failed to fetch tools: ${fetchError.message}`);
    }

    console.log(`✅ Found ${tools.length} tools to migrate\n`);

    // Step 2: Check if table exists in new project
    console.log('📋 Checking schema in new project...');
    const { data: existingTools, error: checkError } = await newSupabase
      .from('mcp_tools')
      .select('id')
      .limit(1);

    if (checkError && checkError.code !== 'PGRST116') {
      console.log('⚠️  Table might not exist yet. It will be created on first insert.\n');
    } else {
      console.log('✅ Schema ready\n');
    }

    // Step 3: Insert data into new project
    console.log('📤 Inserting data into new project...');
    
    // Insert in batches to avoid timeout
    const batchSize = 100;
    for (let i = 0; i < tools.length; i += batchSize) {
      const batch = tools.slice(i, i + batchSize);
      const { error: insertError } = await newSupabase
        .from('mcp_tools')
        .insert(batch);

      if (insertError) {
        throw new Error(`Failed to insert batch: ${insertError.message}`);
      }

      console.log(`  ✓ Inserted ${Math.min(i + batchSize, tools.length)}/${tools.length}`);
    }

    console.log('\n✅ Migration completed successfully!\n');
    console.log('📝 Next steps:');
    console.log('1. Update your .env file with new Supabase credentials:');
    console.log(`   VITE_SUPABASE_URL="${newUrl}"`);
    console.log(`   VITE_SUPABASE_PUBLISHABLE_KEY="${newKey}"`);
    console.log('2. Commit and push changes');
    console.log('3. Redeploy on Vercel');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrate();

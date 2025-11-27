const fs = require('fs');
const path = require('path');

/**
 * Cleanup Script
 * 
 * Executes the removal of redundant files and directories identified in the project.
 * These files are remnants of the previous architecture and are currently empty or unused.
 */

const filesToDelete = [
  // Root Level Redundancies
  'types.ts',
  'App.tsx',
  
  // Legacy Services (Moved to apps/backend or apps/frontend)
  'services/mockTools.ts',
  'services/geminiService.ts',
  
  // Legacy Components (Moved to apps/frontend)
  'components/InputForm.tsx',
  'components/Dashboard.tsx',
  
  // Legacy Backend Structure
  'backend/api/mockTools.ts',
  'backend/agent/geminiService.ts',
  
  // Legacy Frontend Structure
  'frontend/components/InputForm.tsx',
  'frontend/components/Dashboard.tsx',
  'frontend/App.tsx',
  
  // Legacy Tests (Moved to tests/automation)
  'tests/ui/smoke.test.ts',
  'tests/api/tools.test.ts'
];

// Directories to attempt to remove if they become empty after file deletion
const dirsToClean = [
  'services',
  'components',
  'backend/api',
  'backend/agent',
  'backend',
  'frontend/components',
  'frontend',
  'tests/ui',
  'tests/api'
];

console.log('--- STARTING PROJECT CLEANUP ---');

// 1. Delete Files
let deletedCount = 0;
filesToDelete.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`[DELETED] ${file}`);
      deletedCount++;
    } catch (err) {
      console.error(`[ERROR] Could not delete ${file}: ${err.message}`);
    }
  } else {
    // console.log(`[SKIP] ${file} not found.`);
  }
});

console.log(`\nFiles removed: ${deletedCount}`);

// 2. Remove Empty Directories (Best Effort)
console.log('\n--- CLEANING EMPTY DIRECTORIES ---');
dirsToClean.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (fs.existsSync(dirPath)) {
        try {
            const files = fs.readdirSync(dirPath);
            if (files.length === 0) {
                fs.rmdirSync(dirPath);
                console.log(`[REMOVED DIR] ${dir}`);
            }
        } catch (e) {
            // Directory likely not empty or permission error, safe to ignore
        }
    }
});

console.log('\n--- CLEANUP COMPLETE ---');

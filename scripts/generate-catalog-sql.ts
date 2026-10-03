import { generateMigrationSql } from '../src/backend/migration/product-importer.ts';
import fs from 'node:fs';

const result = generateMigrationSql('./src/content/products');
const sql = [
  '-- FIT MONK CATALOG SEED MIGRATION (26 Products)',
  '-- Auto-generated from existing content collections without data loss',
  '',
  '-- Categories',
  ...result.categoryStatements,
  '',
  '-- Products',
  ...result.productStatements,
  '',
  '-- Product Variants',
  ...result.variantStatements,
  '',
  '-- Media & Associations',
  ...result.mediaStatements
].join('\n\n');

fs.writeFileSync('./src/backend/db/migrations/0003_catalog_seed.sql', sql);
console.log('Successfully generated catalog seed SQL. Migrated products:', result.totalProductsMigrated);

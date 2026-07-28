import { createClient } from 'next-sanity';

// Strip any accidental surrounding quotes that env tooling might add
const rawProjectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '').replace(/^["']|["']$/g, '');
const rawDataset = (process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production').replace(/^["']|["']$/g, '');

// Valid Sanity project IDs are a-z, 0-9, and dashes only
export const isSanityConfigured = /^[a-z0-9-]+$/.test(rawProjectId);

export const client = createClient({
  projectId: isSanityConfigured ? rawProjectId : 'placeholder',
  dataset: rawDataset || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

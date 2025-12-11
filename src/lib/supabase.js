// ============================================
// SUPABASE CLIENT - MURAT DEMİRHAN PORTFOLYO
// Direct client-side Supabase connection
// Bypasses Vercel serverless cold starts!
// ============================================

import { createClient } from '@supabase/supabase-js';

// Public Supabase credentials (safe to expose - RLS protects data)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

// Create Supabase client
export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

/**
 * Helper: Construct public storage URL from path
 * If image_url is a path like "artworks/img1.jpg", convert to full URL
 */
export function getPublicStorageUrl(path, bucket = 'artworks') {
    if (!path) return null;

    // Already a full URL
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
        return path;
    }

    // Construct public URL
    return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

export default supabase;

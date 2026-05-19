// =============================================================================
// Invoice Extract API - extracts booking data from text using AI.
// STAGE 2: Implement with Gemini 2.5 Flash.
//   npm i @google/generative-ai
//   GEMINI_API_KEY in .env.local
// For now this returns 501 — the UI falls back to manual entry.
// =============================================================================

import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';

export async function POST() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(
    {
      error:
        'KI-Extraktion noch nicht eingerichtet. Bitte manuell ausfüllen oder Gemini-API in Stufe 2 aktivieren.',
    },
    { status: 501 }
  );
}

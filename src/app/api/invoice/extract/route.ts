// =============================================================================
// Invoice Extract API - extracts booking data from text using Gemini 2.5 Flash
// =============================================================================

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getCurrentAdmin } from '@/lib/auth';
import { INVOICE_EXTRACTION_PROMPT } from '@/lib/invoice-constants';

function parseJsonResponse(raw: string): unknown {
  if (!raw) throw new Error('Leere Antwort vom KI-Modell.');
  let s = raw.trim();
  s = s.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '');
  const first = s.indexOf('{');
  const last = s.lastIndexOf('}');
  if (first === -1 || last === -1) throw new Error('Keine JSON-Antwort erkannt.');
  return JSON.parse(s.slice(first, last + 1));
}

function guessApartmentId(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes('kellerchen')) return 'erholungs-kellerchen';
  if (t.includes('apartment') || t.includes('erste etage') || t.includes('erdgeschoss'))
    return 'erholungs-apartment';
  return null;
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY nicht konfiguriert.' },
      { status: 503 }
    );
  }

  try {
    const { text, imageBase64, mimeType } = (await request.json()) as {
      text?: string;
      imageBase64?: string;
      mimeType?: string;
    };

    if (!text && !imageBase64) {
      return NextResponse.json(
        { error: 'Bitte Text oder Bild mitschicken.' },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const parts: Array<
      { text: string } | { inlineData: { mimeType: string; data: string } }
    > = [{ text: INVOICE_EXTRACTION_PROMPT }];

    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: mimeType || 'image/png',
          data: imageBase64,
        },
      });
    } else if (text) {
      parts.push({ text });
    }

    // Try primary model, fall back to older stable model on 503/overload
    const modelCandidates = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    let raw = '';
    let lastError: unknown = null;
    for (const modelName of modelCandidates) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0,
          },
        });
        const result = await model.generateContent({
          contents: [{ role: 'user', parts }],
        });
        raw = result.response.text();
        break;
      } catch (err) {
        lastError = err;
        const msg = err instanceof Error ? err.message : String(err);
        // Only fall through on overload/unavailable errors
        if (!/503|overload|unavailable|high demand/i.test(msg)) {
          throw err;
        }
        console.warn(`[Gemini] ${modelName} overloaded, trying next…`);
      }
    }
    if (!raw) {
      throw lastError || new Error('Alle Gemini-Modelle nicht verfügbar.');
    }
    const data = parseJsonResponse(raw) as Record<string, unknown>;

    // Fallback: try to guess apartment if AI didn't fill it
    if (!data.apartmentId && text) {
      data.apartmentId = guessApartmentId(text);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[API /invoice/extract]', error);
    const message =
      error instanceof Error
        ? error.message
        : 'KI-Extraktion fehlgeschlagen.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// app/actions/nasa-diagnostics.ts
'use server'

import { diagnosticRoverData } from '../lib/nasa-api-utils'; // Adjust path as needed

export async function runNasaDiagnostics() {
  try {
    const curiosityDiagnostics = await diagnosticRoverData('curiosity');
    const perseveranceDiagnostics = await diagnosticRoverData('perseverance');

    return {
      curiosity: curiosityDiagnostics,
      perseverance: perseveranceDiagnostics
    };
  } catch (error) {
    console.error('Diagnostics failed:', error);
    return {
      error: error.message
    };
  }
}
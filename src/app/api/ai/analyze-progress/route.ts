import { NextResponse } from 'next/server';
import { getGeminiClient, GEMINI_MODEL } from '@/lib/ai/gemini';
import { PROGRESS_ANALYSIS_PROMPT, PROGRESS_COMPARISON_PROMPT } from '@/lib/ai/prompts';
import { parseProgressAnalysis } from '@/lib/ai/parsers';

export async function POST(request: Request) {
  try {
    const { image, previousImage } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    const client = getGeminiClient();
    const isComparison = !!previousImage;
    const prompt = isComparison ? PROGRESS_COMPARISON_PROMPT : PROGRESS_ANALYSIS_PROMPT;

    const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [
      { text: prompt },
    ];

    if (isComparison) {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: previousImage.replace(/^data:image\/\w+;base64,/, ''),
        },
      });
    }

    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: image.replace(/^data:image\/\w+;base64,/, ''),
      },
    });

    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ role: 'user', parts }],
    });

    const text = response.text ?? '';
    const analysis = parseProgressAnalysis(text);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Progress analysis error:', error);
    const message = error instanceof Error ? error.message : 'Failed to analyze progress';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

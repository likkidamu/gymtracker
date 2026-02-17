import { NextResponse } from 'next/server';
import { getGeminiClient, GEMINI_MODEL } from '@/lib/ai/gemini';
import { FOOD_ANALYSIS_PROMPT } from '@/lib/ai/prompts';
import { parseFoodAnalysis } from '@/lib/ai/parsers';

export async function POST(request: Request) {
  try {
    const { image, mealType } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    const client = getGeminiClient();
    const prompt = `${FOOD_ANALYSIS_PROMPT}\n\nMeal type: ${mealType || 'unknown'}`;

    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: image.replace(/^data:image\/\w+;base64,/, ''),
              },
            },
          ],
        },
      ],
    });

    const text = response.text ?? '';
    const analysis = parseFoodAnalysis(text);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Food analysis error:', error);
    const message = error instanceof Error ? error.message : 'Failed to analyze food';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

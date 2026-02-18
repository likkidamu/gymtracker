import { NextResponse } from 'next/server';
import { getGeminiClient, GEMINI_MODEL } from '@/lib/ai/gemini';
import { getTrainingPlanPrompt } from '@/lib/ai/prompts';
import { parseTrainingPlan } from '@/lib/ai/parsers';
import { exerciseDatabase } from '@/data/exerciseDatabase';

export async function POST(request: Request) {
  try {
    const { goal, level, days, equipment, notes } = await request.json();

    if (!goal || !level || !days) {
      return NextResponse.json({ error: 'Goal, level, and days are required' }, { status: 400 });
    }

    const exerciseNames = exerciseDatabase.map((e) => e.name);
    const client = getGeminiClient();
    const prompt = getTrainingPlanPrompt(goal, level, days, equipment || [], notes, exerciseNames);

    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const text = response.text ?? '';
    const plan = parseTrainingPlan(text);
    return NextResponse.json(plan);
  } catch (error) {
    console.error('Plan generation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate plan';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

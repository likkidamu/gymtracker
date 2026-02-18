export const FOOD_ANALYSIS_PROMPT = `You are a nutrition expert. Analyze this food image and return ONLY a JSON object (no markdown, no explanation) with this exact structure:

{
  "foodItems": [
    {
      "name": "item name",
      "calories": 250,
      "portion": "1 cup / 200g",
      "macros": { "protein": 20, "carbs": 30, "fat": 10, "fiber": 3 }
    }
  ],
  "totalCalories": 500,
  "totalMacros": { "protein": 40, "carbs": 60, "fat": 20, "fiber": 6 },
  "mealRating": 7,
  "healthNotes": "Brief health assessment of this meal"
}

Rules:
- Identify every visible food item
- Estimate calories and macros as accurately as possible based on typical portions
- mealRating is 1-10 (10 = very healthy)
- All macro values are in grams
- Return ONLY the JSON object`;

export const PROGRESS_ANALYSIS_PROMPT = `You are a fitness and body composition expert. Analyze this body/physique photo and return ONLY a JSON object (no markdown, no explanation) with this exact structure:

{
  "observations": "Overall physique observations",
  "estimatedBodyFat": "estimated range e.g. 15-18%",
  "muscleGroupNotes": [
    { "group": "Chest", "note": "Well developed upper chest" },
    { "group": "Arms", "note": "Good bicep peak" }
  ],
  "comparisonNotes": "",
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}

Rules:
- Be encouraging but honest
- Provide actionable recommendations
- Note visible muscle development
- Return ONLY the JSON object`;

export const PROGRESS_COMPARISON_PROMPT = `You are a fitness expert. Compare these two physique photos (first is older, second is newer) and return ONLY a JSON object (no markdown, no explanation) with this exact structure:

{
  "observations": "Overall comparison observations",
  "estimatedBodyFat": "estimated current range",
  "muscleGroupNotes": [
    { "group": "Chest", "note": "Noticeable improvement" }
  ],
  "comparisonNotes": "Detailed comparison between the two photos",
  "recommendations": ["Recommendation 1"]
}

Rules:
- Focus on changes and progress between photos
- Be encouraging about improvements
- Return ONLY the JSON object`;

export function getTrainingPlanPrompt(
  goal: string,
  level: string,
  days: number,
  equipment: string[],
  notes?: string,
  exerciseNames?: string[]
): string {
  const exerciseList = exerciseNames && exerciseNames.length > 0
    ? `\n\nAvailable Exercise Database (USE THESE EXACT NAMES):\n${exerciseNames.map((n) => `- ${n}`).join('\n')}`
    : '';

  return `You are an expert personal trainer. Create a workout plan and return ONLY a JSON object (no markdown, no explanation) with this exact structure:

{
  "name": "Plan Name",
  "duration": "4 weeks",
  "workoutDays": [
    {
      "dayNumber": 1,
      "name": "Day name (e.g. Push Day)",
      "focusMuscleGroups": ["Chest", "Shoulders", "Triceps"],
      "exercises": [
        {
          "name": "Bench Press",
          "sets": 4,
          "reps": "8-10",
          "restSeconds": 90,
          "notes": "Focus on controlled eccentric",
          "muscleGroup": "Chest"
        }
      ],
      "estimatedDuration": 60,
      "restDay": false
    }
  ]
}
${exerciseList}

Requirements:
- Goal: ${goal}
- Fitness Level: ${level}
- Training Days per Week: ${days}
- Available Equipment: ${equipment.join(', ')}
${notes ? `- Additional Notes: ${notes}` : ''}

Rules:
- IMPORTANT: You MUST pick exercise names from the Available Exercise Database above. Use the exact names provided. Do not invent new exercise names.
- Include ${days} workout days (no rest days in the output unless explicitly needed)
- Each day should have 5-8 exercises
- Include proper warm-up exercises
- Rest times appropriate for the goal
- Progressive overload built in via rep ranges
- Return ONLY the JSON object`;
}

export const STORAGE_KEYS = {
  FOOD: 'gymtracker_food',
  PROGRESS: 'gymtracker_progress',
  TRAINING: 'gymtracker_training',
} as const;

export const MEAL_TYPES = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
] as const;

export const FITNESS_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
] as const;

export const TRAINING_GOALS = [
  { value: 'muscle_gain', label: 'Muscle Gain' },
  { value: 'fat_loss', label: 'Fat Loss' },
  { value: 'strength', label: 'Strength' },
  { value: 'endurance', label: 'Endurance' },
  { value: 'general_fitness', label: 'General Fitness' },
] as const;

export const EQUIPMENT_OPTIONS = [
  'Barbell',
  'Dumbbells',
  'Kettlebells',
  'Pull-up Bar',
  'Cables',
  'Machines',
  'Resistance Bands',
  'Bodyweight Only',
  'Bench',
  'Squat Rack',
] as const;

export const IMAGE_MAX_WIDTH = 800;
export const THUMBNAIL_MAX_WIDTH = 200;
export const IMAGE_QUALITY = 0.8;
export const THUMBNAIL_QUALITY = 0.6;

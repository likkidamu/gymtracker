import { FoodEntry } from '@/types/food';
import { ProgressEntry } from '@/types/progress';
import { TrainingPlan } from '@/types/training';
import { LocalStorageService } from './localStorage';
import { IStorageService } from './types';
import { STORAGE_KEYS } from '@/lib/utils/constants';

// Factory — swap implementations here when migrating to a DB
export const foodStorage: IStorageService<FoodEntry> = new LocalStorageService<FoodEntry>(STORAGE_KEYS.FOOD);
export const progressStorage: IStorageService<ProgressEntry> = new LocalStorageService<ProgressEntry>(STORAGE_KEYS.PROGRESS);
export const trainingStorage: IStorageService<TrainingPlan> = new LocalStorageService<TrainingPlan>(STORAGE_KEYS.TRAINING);

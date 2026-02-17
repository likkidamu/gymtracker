import { BaseEntity } from '@/types/common';
import { IStorageService } from './types';

export class LocalStorageService<T extends BaseEntity> implements IStorageService<T> {
  constructor(private key: string) {}

  private getData(): T[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(this.key);
    return raw ? JSON.parse(raw) : [];
  }

  private setData(data: T[]): void {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  async getAll(): Promise<T[]> {
    return this.getData().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getById(id: string): Promise<T | null> {
    return this.getData().find((item) => item.id === id) || null;
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const now = new Date().toISOString();
    const item = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    } as T;

    const all = this.getData();
    all.push(item);
    this.setData(all);
    return item;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const all = this.getData();
    const index = all.findIndex((item) => item.id === id);
    if (index === -1) throw new Error(`Item ${id} not found`);

    all[index] = { ...all[index], ...data, updatedAt: new Date().toISOString() };
    this.setData(all);
    return all[index];
  }

  async delete(id: string): Promise<void> {
    const all = this.getData().filter((item) => item.id !== id);
    this.setData(all);
  }

  async query(predicate: (item: T) => boolean): Promise<T[]> {
    return this.getData().filter(predicate);
  }
}

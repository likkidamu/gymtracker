import { BaseEntity } from '@/types/common';
import { IStorageService } from './types';
import { createClient } from '@/lib/supabase/client';

export class SupabaseStorageService<T extends BaseEntity> implements IStorageService<T> {
  constructor(
    private table: string,
    private mapToDb: (data: Partial<T>) => Record<string, unknown>,
    private mapFromDb: (row: Record<string, unknown>) => T
  ) {}

  private get supabase() {
    return createClient();
  }

  private async getUserId(): Promise<string> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    return user.id;
  }

  async getAll(): Promise<T[]> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(this.mapFromDb);
  }

  async getById(id: string): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return this.mapFromDb(data);
  }

  async create(input: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const userId = await this.getUserId();
    const dbData = this.mapToDb(input as Partial<T>);

    const { data, error } = await this.supabase
      .from(this.table)
      .insert({ ...dbData, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return this.mapFromDb(data);
  }

  async update(id: string, input: Partial<T>): Promise<T> {
    const dbData = this.mapToDb(input);

    const { data, error } = await this.supabase
      .from(this.table)
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapFromDb(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.table)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async query(predicate: (item: T) => boolean): Promise<T[]> {
    const all = await this.getAll();
    return all.filter(predicate);
  }
}

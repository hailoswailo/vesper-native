import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Generic persistence contract. AsyncStorage backs it today; a Supabase-backed
 * implementation can drop in later without any screen code changing.
 */
export interface Repository<T extends { id: string }> {
  all(): Promise<T[]>;
  get(id: string): Promise<T | undefined>;
  upsert(item: T): Promise<T>;
  remove(id: string): Promise<void>;
  clear(): Promise<void>;
}

export class AsyncStorageRepository<T extends { id: string }> implements Repository<T> {
  constructor(private readonly key: string) {}

  async all(): Promise<T[]> {
    const raw = await AsyncStorage.getItem(this.key);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as T[];
    } catch {
      return [];
    }
  }

  async get(id: string): Promise<T | undefined> {
    const items = await this.all();
    return items.find((item) => item.id === id);
  }

  async upsert(item: T): Promise<T> {
    const items = await this.all();
    const index = items.findIndex((existing) => existing.id === item.id);
    if (index >= 0) {
      items[index] = item;
    } else {
      items.push(item);
    }
    await AsyncStorage.setItem(this.key, JSON.stringify(items));
    return item;
  }

  async remove(id: string): Promise<void> {
    const items = await this.all();
    await AsyncStorage.setItem(this.key, JSON.stringify(items.filter((item) => item.id !== id)));
  }

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(this.key);
  }
}

export async function getRaw<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function setRaw<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeRaw(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

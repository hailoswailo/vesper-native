import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Not wired into the app's data flow yet — the Apply/Directory/Goals screens
 * still run entirely on the AsyncStorage-backed Repository<T> in
 * src/lib/repository.ts. This client exists so the connection is ready when
 * we migrate off local-only storage (see README "Status / next steps").
 *
 * The anon/publishable key is safe to ship in the client bundle by design —
 * it only grants what Row Level Security policies allow. Nothing sensitive.
 */
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
    : null;

if (!supabase && __DEV__) {
  console.warn(
    '[supabase] EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY are not set — Supabase client not initialized.'
  );
}

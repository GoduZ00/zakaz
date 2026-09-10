import { supabase } from '../lib/supabase';

const STORAGE_RE = /\/storage\/v1\/object\/public\/(.*)$/;

export function imgUrl(url: string | undefined | null, width: number): string {
  if (!url) return '/placeholder.png';
  const match = url.match(STORAGE_RE);
  if (!match) return url;
  const base = (supabase as unknown as { supabaseUrl?: string }).supabaseUrl || '';
  const path = match[1];
  return `${base}/storage/v1/render/image/public/${path}?width=${width}&resize=contain`;
}
function getSupabaseClient() {
  const config = window.CAFE_CIELO_SUPABASE;

  if (!config || !config.url || !config.anonKey) {
    return null;
  }

  if (config.url.includes("PEGA_AQUI") || config.anonKey.includes("PEGA_AQUI")) {
    return null;
  }

  if (!window.supabase?.createClient) {
    return null;
  }

  if (!window.__cafeCieloSupabaseClient) {
    window.__cafeCieloSupabaseClient = window.supabase.createClient(config.url, config.anonKey);
  }

  return window.__cafeCieloSupabaseClient;
}

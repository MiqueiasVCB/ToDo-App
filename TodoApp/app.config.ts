import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: "ToDoListApp",
  name: "ToDoListApp",
  extra: {
    SUPABASE_URL: "https://hhlchymeqjeygsxhunyt.supabase.co",
    SUPABASE_ANON_KEY:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhobGNoeW1lcWpleWdzeGh1bnl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2ODA4NzMsImV4cCI6MjA2OTI1Njg3M30.0tHROa-nJNz0PgvjXy5jvTy2nQehmAFXM_D1hmbhP8Y",
  },
  version: "1.0.0",
  orientation: "portrait",
  ios: {
    supportsTablet: true,
  },
});

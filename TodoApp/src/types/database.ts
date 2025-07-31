export interface Profile {
  id: string;
  full_name: string;
  role: "user" | "admin";
  avatar_url?: string;
}

export interface Task {
  id: number;
  user_id: string;
  created_at: string;
  title: string;
  description?: string;
  priority: "Baixa" | "Média" | "Alta";
  status: "pending" | "completed";
  is_favorited: boolean;
}

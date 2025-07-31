import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../../api/supabase";

const StatCard = ({
  label,
  value,
  borderColor,
}: {
  label: string;
  value: number;
  borderColor: string;
}) => (
  <View style={[styles.statCard, { borderColor }]}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const AdminDashboardScreen = () => {
  const [stats, setStats] = useState({
    users: 0,
    created: 0,
    completed: 0,
    updated: 0,
    deleted: 0,
    favorited: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    const [
      { count: users },
      { count: created },
      { count: completed },
      { count: updated },
      { count: deleted },
      { count: favorited },
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase
        .from("task_audit")
        .select("*", { count: "exact", head: true })
        .eq("action", "created"),
      supabase
        .from("task_audit")
        .select("*", { count: "exact", head: true })
        .eq("action", "completed"),
      supabase
        .from("task_audit")
        .select("*", { count: "exact", head: true })
        .eq("action", "updated"),
      supabase
        .from("task_audit")
        .select("*", { count: "exact", head: true })
        .eq("action", "deleted"),
      supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("is_favorited", true),
    ]);
    setStats({
      users: users || 0,
      created: created || 0,
      completed: completed || 0,
      updated: updated || 0,
      deleted: deleted || 0,
      favorited: favorited || 0,
    });
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Estatísticas</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#FFF" style={{ flex: 1 }} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={styles.statsGrid}>
            <StatCard
              label="Usuários Registrados"
              value={stats.users}
              borderColor="rgba(126, 34, 206, 0.5)"
            />
            <StatCard
              label="Tarefas Criadas"
              value={stats.created}
              borderColor="rgba(224, 224, 224, 0.5)"
            />
            <StatCard
              label="Tarefas Concluídas"
              value={stats.completed}
              borderColor="rgba(3, 218, 197, 0.5)"
            />
            <StatCard
              label="Tarefas Removidas"
              value={stats.deleted}
              borderColor="rgba(207, 102, 121, 0.5)"
            />
            <StatCard
              label="Tarefas Favoritadas"
              value={stats.favorited}
              borderColor="rgba(249, 168, 38, 0.5)"
            />
            <StatCard
              label="Tarefas Editadas"
              value={stats.updated}
              borderColor="rgba(90, 103, 216, 0.6)"
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A1A2E" },
  header: { padding: 20 },
  title: { color: "#FFF", fontSize: 24, fontWeight: "bold" },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  statCard: {
    backgroundColor: "#2E2E50",
    width: "45%",
    aspectRatio: 1.2,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: "2.5%",
    borderWidth: 1.5,
  },
  statValue: { color: "#FFFFFF", fontSize: 40, fontWeight: "bold" },
  statLabel: {
    color: "#E0E0E0",
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
    paddingHorizontal: 5,
  },
});

export default AdminDashboardScreen;

// NÃO ESTÁ SENDO MAIS UTILIZADO //

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "../../api/supabase";
import { Task } from "../../types/database";

interface TaskWithProfile extends Task {
  profiles: {
    full_name: string;
  } | null;
}

const AdminTaskListView = () => {
  const [tasks, setTasks] = useState<TaskWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: false });

    if (error) {
      Alert.alert("Erro ao buscar tarefas", error.message);
    } else {
      setTasks(data as TaskWithProfile[]);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchAllTasks();
    }, [])
  );

  const handleDeleteTask = (task: Task) => {
    Alert.alert(
      "Apagar Tarefa",
      `Você tem certeza que quer apagar a tarefa "${task.title}"? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("tasks")
              .delete()
              .eq("id", task.id);
            if (error) Alert.alert("Erro ao apagar tarefa.", error.message);
            else fetchAllTasks();
          },
        },
      ]
    );
  };

  const renderTask = ({ item }: { item: TaskWithProfile }) => (
    <View style={styles.taskItem}>
      <View style={styles.taskTextContainer}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskOwner}>
          Criado por: {item.profiles?.full_name || "Usuário desconhecido"}
        </Text>
      </View>
      <View style={styles.taskActions}>
        <TouchableOpacity onPress={() => handleDeleteTask(item)}>
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={24}
            color="#CF6679"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Todas as Tarefas</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#FFF" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTask}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhuma tarefa foi criada no sistema ainda.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A1A2E" },
  header: { padding: 20 },
  title: { color: "#FFF", fontSize: 24, fontWeight: "bold" },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E2E50",
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  taskTextContainer: { flex: 1 },
  taskTitle: { color: "#E0E0E0", fontSize: 16, fontWeight: "bold" },
  taskOwner: { color: "#A0A0A0", fontSize: 12, marginTop: 4 },
  taskActions: { flexDirection: "row", alignItems: "center" },
  emptyText: {
    color: "#A0A0A0",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});

export default AdminTaskListView;

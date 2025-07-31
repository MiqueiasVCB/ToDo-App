import React, { useState, useCallback, useMemo, useEffect } from "react";
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
import {
  useFocusEffect,
  RouteProp,
  CompositeScreenProps,
} from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "../../api/supabase";
import { Task } from "../../types/database";
import { RootStackParamList, UserTabParamList } from "../../types/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { TaskModal } from "../../components/TaskModal";

type NavProp = CompositeScreenProps<
  BottomTabScreenProps<UserTabParamList, "UserDashboard">,
  StackScreenProps<RootStackParamList>
>;

type FilterType = "all" | "pending" | "favorited" | "completed";

const UserDashboardScreen = ({ route, navigation }: NavProp) => {
  const { profile } = useAuth();
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (route.params?.openModal) {
      setSelectedTask(null);
      setModalVisible(true);
      navigation.setParams({ openModal: false });
    }
  }, [route.params?.openModal]);

  const fetchTasks = async () => {
    if (!profile) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", profile.id)
      .order("is_favorited", { ascending: false })
      .order("created_at", { ascending: true });
    setLoading(false);
    if (error) Alert.alert("Erro ao buscar tarefas", error.message);
    else setAllTasks(data || []);
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [profile])
  );

  const filteredTasks = useMemo(() => {
    if (activeFilter === "pending") {
      return allTasks.filter((task) => task.status === "pending");
    }
    if (activeFilter === "favorited") {
      return allTasks.filter((task) => task.is_favorited);
    }
    if (activeFilter === "completed") {
      return allTasks.filter((task) => task.status === "completed");
    }
    return allTasks;
  }, [allTasks, activeFilter]);

  const handleSaveTask = async (
    taskData: { title: string; description: string },
    taskId?: number
  ) => {
    if (taskId) {
      const { error } = await supabase
        .from("tasks")
        .update(taskData)
        .eq("id", taskId);
      if (error) Alert.alert("Erro ao atualizar tarefa", error.message);
    } else {
      if (!profile) return;
      const { error } = await supabase
        .from("tasks")
        .insert({ ...taskData, user_id: profile.id });
      if (error) Alert.alert("Erro ao criar tarefa", error.message);
    }
    setModalVisible(false);
    fetchTasks();
  };

  const handleDeleteTask = async (task: Task) => {
    setModalVisible(false);
    Alert.alert("Apagar Tarefa", `Você tem certeza?`, [
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
          else fetchTasks();
        },
      },
    ]);
  };

  const handleToggleFavorite = async (task: Task) => {
    const { error } = await supabase
      .from("tasks")
      .update({ is_favorited: !task.is_favorited })
      .eq("id", task.id);
    if (error) {
      Alert.alert("Erro", error.message);
    } else {
      const updatedTasks = allTasks.map((t) =>
        t.id === task.id ? { ...t, is_favorited: !t.is_favorited } : t
      );
      setAllTasks(updatedTasks);
      setSelectedTask((prev) =>
        prev ? { ...prev, is_favorited: !prev.is_favorited } : null
      );
    }
  };

  const handleToggleStatus = async (task: Task) => {
    const { error } = await supabase
      .from("tasks")
      .update({ status: task.status === "pending" ? "completed" : "pending" })
      .eq("id", task.id);
    if (error) Alert.alert("Erro", error.message);
    else fetchTasks();
  };

  const renderTask = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={[
        styles.taskItem,
        item.status === "completed"
          ? styles.taskItemCompleted
          : styles.taskItemPending,
      ]}
      onPress={() => {
        setSelectedTask(item);
        setModalVisible(true);
      }}
    >
      <TouchableOpacity onPress={() => handleToggleStatus(item)}>
        <MaterialCommunityIcons
          name={
            item.status === "completed"
              ? "checkbox-marked-circle"
              : "checkbox-blank-circle-outline"
          }
          size={28}
          color={item.status === "completed" ? "#03DAC5" : "#A0A0A0"}
        />
      </TouchableOpacity>
      <View style={styles.taskTextContainer}>
        <Text
          style={
            item.status === "completed"
              ? styles.taskTitleCompleted
              : styles.taskTitle
          }
        >
          {item.title}
        </Text>
      </View>
      {item.is_favorited && (
        <MaterialCommunityIcons name="star" size={22} color="#F9A826" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Tarefas</Text>
      </View>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === "all" && styles.filterButtonActive,
          ]}
          onPress={() => setActiveFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "all" && styles.filterTextActive,
            ]}
          >
            Todas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === "pending" && styles.filterButtonActive,
          ]}
          onPress={() => setActiveFilter("pending")}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "pending" && styles.filterTextActive,
            ]}
          >
            A Fazer
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === "favorited" && styles.filterButtonActive,
          ]}
          onPress={() => setActiveFilter("favorited")}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "favorited" && styles.filterTextActive,
            ]}
          >
            Favoritas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === "completed" && styles.filterButtonActive,
          ]}
          onPress={() => setActiveFilter("completed")}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "completed" && styles.filterTextActive,
            ]}
          >
            Concluídas
          </Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#FFFFFF"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTask}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma tarefa encontrada.</Text>
            </View>
          }
        />
      )}
      <TaskModal
        isVisible={isModalVisible}
        onClose={() => {
          setModalVisible(false);
          fetchTasks();
        }}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        onToggleFavorite={handleToggleFavorite}
        task={selectedTask}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A1A2E" },
  header: { padding: 20, paddingBottom: 10 },
  headerTitle: { color: "#FFF", fontSize: 24, fontWeight: "bold" },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#2E2E50",
    borderRadius: 8,
    padding: 5,
  },
  filterButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  filterButtonActive: { backgroundColor: "#7E22CE" },
  filterText: { color: "#E0E0E0", fontSize: 14 },
  filterTextActive: { color: "#FFF", fontWeight: "bold" },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E2E50",
    paddingHorizontal: 15,
    paddingVertical: 18,
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
  },
  taskItemCompleted: { borderColor: "rgba(3, 218, 197, 0.4)" },
  taskItemPending: { borderColor: "rgba(207, 102, 121, 0.4)" },
  taskTextContainer: { flex: 1, marginLeft: 15 },
  taskTitle: { color: "#E0E0E0", fontSize: 16 },
  taskTitleCompleted: {
    color: "#A0A0A0",
    fontSize: 16,
    textDecorationLine: "line-through",
  },
  emptyContainer: { alignItems: "center", marginTop: 50 },
  emptyText: { color: "#A0A0A0", fontSize: 16 },
});

export default UserDashboardScreen;

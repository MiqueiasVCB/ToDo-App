// NÃO ESTÁ SENDO MAIS UTILIZADO //

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { supabase } from "../../api/supabase";
import { RootStackParamList } from "../../types/navigation";
import { Task } from "../../types/database";

type NavProp = StackNavigationProp<RootStackParamList, "TaskForm">;
type Route = RouteProp<RootStackParamList, "TaskForm">;

const TaskFormScreen = ({
  route,
  navigation,
}: {
  route: Route;
  navigation: NavProp;
}) => {
  const { taskId } = route.params;
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", taskId)
        .single();
      if (error) {
        Alert.alert("Erro", "Não foi possível carregar os dados da tarefa.");
        navigation.goBack();
      } else {
        setTask(data);
        setTitle(data.title);
        setDescription(data.description || "");
      }
      setLoading(false);
    };
    fetchTask();
  }, [taskId]);

  const handleUpdateTask = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("tasks")
      .update({ title, description })
      .eq("id", taskId);
    if (error) Alert.alert("Erro ao atualizar", error.message);
    else {
      Alert.alert("Sucesso", "Tarefa atualizada!");
      navigation.goBack();
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#FFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
          <View style={styles.content}>
            <Text style={styles.title}>Editar Tarefa</Text>
            <Text style={styles.label}>Título</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
            />
            <Text style={styles.label}>Descrição (Opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              multiline
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleUpdateTask}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Salvar Alterações</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A1A2E" },
  content: { padding: 20 },
  backButton: { padding: 20, paddingTop: 10, paddingBottom: 0 },
  backButtonText: { color: "#E0E0E0", fontSize: 16 },
  title: { color: "#FFF", fontSize: 32, fontWeight: "bold", marginBottom: 30 },
  label: { color: "#E0E0E0", fontSize: 16, marginBottom: 10 },
  input: {
    backgroundColor: "#2E2E50",
    color: "#FFF",
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
  },
  textArea: { height: 120, textAlignVertical: "top" },
  button: {
    backgroundColor: "#7E22CE",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
});

export default TaskFormScreen;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Task } from "../types/database";

type TaskModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onSave: (
    taskData: { title: string; description: string },
    taskId?: number
  ) => void;
  onDelete: (task: Task) => void;
  onToggleFavorite: (task: Task) => void;
  task: Task | null;
};

export const TaskModal = ({
  isVisible,
  onClose,
  onSave,
  onDelete,
  onToggleFavorite,
  task,
}: TaskModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [task, isVisible]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("Atenção", "O título da tarefa é obrigatório.");
      return;
    }
    onSave({ title, description }, task?.id);
  };

  const handleDelete = () => {
    if (task) onDelete(task);
  };
  const handleToggleFavorite = () => {
    if (task) onToggleFavorite(task);
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.backdrop}
      >
        <Pressable style={styles.backdropPressable} onPress={onClose} />
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialCommunityIcons name="close" size={26} color="#A0A0A0" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {task ? "Detalhes da Tarefa" : "Nova Tarefa"}
          </Text>
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
          {task && (
            <Text style={styles.dateText}>
              Criada em: {new Date(task.created_at).toLocaleDateString("pt-BR")}{" "}
              às{" "}
              {new Date(task.created_at).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          )}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>
              {task ? "Salvar Alterações" : "Criar Tarefa"}
            </Text>
          </TouchableOpacity>
          {task && (
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleToggleFavorite}
              >
                <MaterialCommunityIcons
                  name={task.is_favorited ? "star" : "star-outline"}
                  size={22}
                  color={task.is_favorited ? "#F9A826" : "#A0A0A0"}
                />
                <Text style={styles.actionButtonText}>Favoritar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleDelete}
              >
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={22}
                  color="#CF6679"
                />
                <Text style={[styles.actionButtonText, { color: "#CF6679" }]}>
                  Apagar
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Pressable style={styles.backdropPressable} onPress={onClose} />
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  backdropPressable: { flex: 1, width: "100%" },
  modalContainer: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#2E2E50",
    borderRadius: 15,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1.5,
    borderColor: "rgba(126, 34, 206, 0.5)",
  },
  closeButton: { position: "absolute", top: 15, right: 15, zIndex: 1 },
  modalTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    marginRight: 20,
  },
  label: { color: "#E0E0E0", fontSize: 14, marginBottom: 8 },
  input: {
    backgroundColor: "#1A1A2E",
    color: "#FFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: { height: 100, textAlignVertical: "top" },
  dateText: {
    color: "#A0A0A0",
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 20,
    alignSelf: "flex-end",
  },
  saveButton: {
    backgroundColor: "#7E22CE",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 15,
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#404066",
  },
  actionButton: { flexDirection: "row", alignItems: "center" },
  actionButtonText: { color: "#A0A0A0", fontSize: 16, marginLeft: 8 },
});

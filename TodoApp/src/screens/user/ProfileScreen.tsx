import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { supabase } from "../../api/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

const ProfileScreen = () => {
  const { profile, session, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
    }
  }, [profile]);

  const copyToClipboard = async () => {
    if (profile?.id) {
      await Clipboard.setStringAsync(profile.id);
      Alert.alert("Copiado!", "Seu ID de usuário foi copiado.");
    }
  };

  const handleUpdateProfile = async () => {
    if (!fullName.trim())
      return Alert.alert("Erro", "O nome não pode ficar em branco.");
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", session!.user.id);
    if (error) Alert.alert("Erro ao atualizar", error.message);
    else Alert.alert("Sucesso!", "Seu nome foi atualizado.");
    setLoading(false);
  };

  const handleUpdatePassword = async () => {
    if (!newPassword)
      return Alert.alert("Erro", "A nova senha não pode estar em branco.");
    if (newPassword !== confirmNewPassword)
      return Alert.alert("Erro", "As senhas não coincidem.");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) Alert.alert("Erro ao alterar senha", error.message);
    else {
      Alert.alert("Sucesso!", "Sua senha foi alterada.");
      setNewPassword("");
      setConfirmNewPassword("");
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={styles.content}>
            <View style={styles.profileHeader}>
              <Text style={styles.title}>{fullName}</Text>
              <Text style={styles.roleText}>
                {profile?.role === "user" ? "Usuário" : "Administrador"}
              </Text>
              <TouchableOpacity
                style={styles.idContainer}
                onPress={copyToClipboard}
              >
                <Text style={styles.idText}>{profile?.id}</Text>
                <MaterialCommunityIcons
                  name="content-copy"
                  size={16}
                  color="#A0A0A0"
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Informações Pessoais</Text>
              <Text style={styles.label}>Nome Completo</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
              />
              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={handleUpdateProfile}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Salvar Alterações</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Alterar Senha</Text>
              <Text style={styles.label}>Nova Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#A0A0A0"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <Text style={styles.label}>Confirmar Nova Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#A0A0A0"
                secureTextEntry
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
              />
              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={handleUpdatePassword}
                disabled={loading}
              >
                <Text style={styles.buttonTextSecondary}>Alterar Senha</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Ações da Conta</Text>
              <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
                <Text style={styles.logoutButtonText}>Sair da Conta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A1A2E" },
  content: { padding: 20, paddingBottom: 40 },
  profileHeader: { alignItems: "center", marginBottom: 30, marginTop: 20 },
  title: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  roleText: {
    color: "#7E22CE",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 5,
    textTransform: "capitalize",
  },
  idContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#2E2E50",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  idText: { color: "#A0A0A0", fontSize: 12, fontFamily: "monospace" },
  card: {
    backgroundColor: "#2E2E50",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
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
  buttonPrimary: {
    backgroundColor: "#7E22CE",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  buttonSecondary: {
    backgroundColor: "#F9A826",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonTextSecondary: { color: "#1A1A2E", fontWeight: "bold", fontSize: 16 },
  logoutButton: {
    borderColor: "#CF6679",
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: { color: "#CF6679", fontWeight: "bold", fontSize: 16 },
});

export default ProfileScreen;

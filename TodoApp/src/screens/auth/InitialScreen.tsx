import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types/navigation";

type NavProp = StackNavigationProp<RootStackParamList, "Initial">;

const InitialScreen = ({ navigation }: { navigation: NavProp }) => (
  <View style={styles.container}>
    <StatusBar barStyle="light-content" />
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoCheck}>✓</Text>
      </View>
      <Text style={styles.title}>TaskFlow</Text>
      <Text style={styles.subtitle}>Sua produtividade em primeiro lugar</Text>
    </View>
    <View style={styles.footer}>
      <Text style={styles.footerTitle}>Comece agora</Text>
      <TouchableOpacity
        style={styles.buttonLogin}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Fazer Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonRegister}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.buttonText}>Criar Conta</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A2E",
    padding: 20,
    justifyContent: "space-between",
  },
  header: { alignItems: "center", flex: 1, justifyContent: "center" },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#7E22CE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logoCheck: { color: "#FFF", fontSize: 40, fontWeight: "bold" },
  title: { fontSize: 42, color: "#FFF", fontWeight: "bold" },
  subtitle: { fontSize: 18, color: "#E0E0E0", marginTop: 8 },
  footer: { paddingBottom: 20 },
  footerTitle: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 18,
    marginBottom: 15,
  },
  buttonLogin: {
    backgroundColor: "#7E22CE",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonRegister: {
    backgroundColor: "#2E2E50",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
});

export default InitialScreen;

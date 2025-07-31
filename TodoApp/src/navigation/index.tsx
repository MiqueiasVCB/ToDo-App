import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createBottomTabNavigator,
  BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs";
import { useAuth } from "../contexts/AuthContext";
import {
  AdminTabParamList,
  RootStackParamList,
  UserTabParamList,
} from "../types/navigation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import InitialScreen from "../screens/auth/InitialScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import UserDashboardScreen from "../screens/user/UserDashboardScreen";
import ProfileScreen from "../screens/user/ProfileScreen";
import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import AdminProfileScreen from "../screens/admin/AdminProfileScreen";

const Stack = createStackNavigator<RootStackParamList>();
const UserBottomTab = createBottomTabNavigator<UserTabParamList>();
const AdminBottomTab = createBottomTabNavigator<AdminTabParamList>();

const commonTabNavigatorOptions = (insets: {
  bottom: number;
}): BottomTabNavigationOptions => ({
  headerShown: false,
  tabBarActiveTintColor: "#FFFFFF",
  tabBarInactiveTintColor: "#A0A0A0",
  tabBarStyle: {
    backgroundColor: "#2E2E50",
    height: 65 + insets.bottom,
    paddingTop: 10,
    paddingBottom: insets.bottom > 0 ? insets.bottom - 5 : 5,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderTopColor: "rgba(126, 34, 206, 0.5)",
    borderLeftColor: "rgba(126, 34, 206, 0.5)",
    borderRightColor: "rgba(126, 34, 206, 0.5)",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  tabBarItemStyle: { justifyContent: "center", alignItems: "center" },
  tabBarLabelStyle: { fontSize: 12, marginTop: 0 },
});

function UserTabs() {
  const insets = useSafeAreaInsets();
  return (
    <UserBottomTab.Navigator screenOptions={commonTabNavigatorOptions(insets)}>
      <UserBottomTab.Screen
        name="UserDashboard"
        component={UserDashboardScreen}
        options={{
          tabBarLabel: "Início",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-variant"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <UserBottomTab.Screen
        name="AddTask"
        options={{
          tabBarLabel: "Adicionar",
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="plus-circle"
              color={"#FFFFFF"}
              size={32}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("UserDashboard", { openModal: true });
          },
        })}
      >
        {() => null}
      </UserBottomTab.Screen>
      <UserBottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Conta",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-circle"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </UserBottomTab.Navigator>
  );
}

function AdminTabs() {
  const insets = useSafeAreaInsets();
  return (
    <AdminBottomTab.Navigator screenOptions={commonTabNavigatorOptions(insets)}>
      <AdminBottomTab.Screen
        name="UserDashboard"
        component={UserDashboardScreen}
        options={{
          tabBarLabel: "Minhas Tarefas",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-variant"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <AdminBottomTab.Screen
        name="AddTask"
        options={{
          tabBarLabel: "Adicionar",
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="plus-circle"
              color={"#FFFFFF"}
              size={32}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("UserDashboard", { openModal: true });
          },
        })}
      >
        {() => null}
      </AdminBottomTab.Screen>
      <AdminBottomTab.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{
          tabBarLabel: "Estatísticas",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="chart-line"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <AdminBottomTab.Screen
        name="AdminProfile"
        component={AdminProfileScreen}
        options={{
          tabBarLabel: "Conta",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-cog"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </AdminBottomTab.Navigator>
  );
}

export default function RootNavigator() {
  const { session, profile, loading } = useAuth();
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1A1A2E",
        }}
      >
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!session ? (
        <>
          <Stack.Screen name="Initial" component={InitialScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : profile?.role === "admin" ? (
        <Stack.Screen name="AdminApp" component={AdminTabs} />
      ) : (
        <Stack.Screen name="UserApp" component={UserTabs} />
      )}
    </Stack.Navigator>
  );
}

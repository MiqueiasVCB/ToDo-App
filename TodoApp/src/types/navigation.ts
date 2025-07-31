import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  Initial: undefined;
  Login: undefined;
  Register: undefined;
  UserApp: NavigatorScreenParams<UserTabParamList>;
  AdminApp: NavigatorScreenParams<AdminTabParamList>;
};

export type UserTabParamList = {
  UserDashboard: { openModal?: boolean };
  AddTask: undefined;
  Profile: undefined;
};

export type AdminTabParamList = {
  UserDashboard: { openModal?: boolean };
  AdminDashboard: undefined;
  AddTask: undefined;
  AdminProfile: undefined;
};

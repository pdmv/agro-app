import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import ChangeAvatarScreen from "../screens/Profile/ChangeAvatarScreen";
import ProfileDetailScreen from "../screens/Profile/ProfileDetailScreen";
import ChangePasswordScreen from "../screens/Profile/ChangePasswordScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";

const Stack = createStackNavigator();

export default ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
        name="ProfileDetail"
        component={ProfileDetailScreen}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Thông tin người dùng",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} style={{ paddingLeft: 10 }} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="ChangeAvatar"
        component={ChangeAvatarScreen}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Đổi ảnh đại diện",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} style={{ paddingLeft: 10 }} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Đổi mật khẩu",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} style={{ paddingLeft: 10 }} />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};
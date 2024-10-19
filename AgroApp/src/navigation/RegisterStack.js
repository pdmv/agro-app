import { createStackNavigator } from "@react-navigation/stack";
import { View } from "react-native";
import RegisterScreen from "../screens/Register/RegisterScreen";
import RegisterAccountScreen from "../screens/Register/RegisterAccountScreen";
import PhoneNumberAuthentication from "../screens/Register/PhoneNumberAuthentication";

const Stack = createStackNavigator();

const RegisterStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="PhoneNumberAuthentication" component={PhoneNumberAuthentication} />
      <Stack.Screen name="RegisterAccount" component={RegisterAccountScreen} />
    </Stack.Navigator>
  );
};

export default RegisterStack;
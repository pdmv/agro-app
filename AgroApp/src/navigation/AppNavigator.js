import { createStackNavigator } from "@react-navigation/stack";
import MainTabs from "./MainTabs";
import LoginScreen from "../screens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import RegisterStack from "./RegisterStack";
import { TouchableOpacity } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import ProductStack from "./ProductStack";
import SupplierStack from "./SupplierStack";
import PurchaseOrderStack from "./PurchaseOrderStack";
import PriceStack from "./PriceStack";
import OrderScreen from "../screens/OrderScreen";
import OrderStack from "./OrderStack";
import PaymentStack from "./PaymentStack";

const Stack = createStackNavigator();

export default AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            gestureEnabled: true,
          }}
        />
        <Stack.Screen name="RegisterStack" component={RegisterStack} />

        <Stack.Screen
          name="Product"
          component={ProductStack}
          options={({ navigation }) => ({
            headerShown: false,
            // title: "Quản lý mặt hàng",
            // headerLeft: () => (
            //   <TouchableOpacity onPress={() => navigation.goBack()}>
            //     <Feather name="arrow-left" size={24} style={{ paddingLeft: 10 }} />
            //   </TouchableOpacity>
            // ),
          })}
        />

        <Stack.Screen
          name="Supplier"
          component={SupplierStack}
          options={({ navigation }) => ({
            headerShown: false,
            // title: "Quản lý nhà cung cấp",
            // headerLeft: () => (
            //   <TouchableOpacity onPress={() => navigation.goBack()}>
            //     <Feather name="arrow-left" size={24} style={{ paddingLeft: 10 }} />
            //   </TouchableOpacity>
            // ),
          })}
        />

        <Stack.Screen
          name="PurchaseOrderStack"
          component={PurchaseOrderStack}
          options={({ navigation }) => ({
            headerShown: false,
            // title: "Quản lý đơn nhập hàng",
            // headerLeft: () => (
            //   <TouchableOpacity onPress={() => navigation.goBack()}>
            //     <Feather name="arrow-left" size={24} style={{ paddingLeft: 10 }} />
            //   </TouchableOpacity>
            // ),
          })}
        />

        <Stack.Screen
          name="PriceStack"
          component={PriceStack}
          options={({ navigation }) => ({
            headerShown: false,
            // title: "Quản lý đơn nhập hàng",
            // headerLeft: () => (
            //   <TouchableOpacity onPress={() => navigation.goBack()}>
            //     <Feather name="arrow-left" size={24} style={{ paddingLeft: 10 }} />
            //   </TouchableOpacity>
            // ),
          })}
        />

        <Stack.Screen
          name="OrderScreen"
          component={OrderScreen}
          options={({ navigation }) => ({
            headerShown: true,
            title: "Đặt hàng",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Feather name="arrow-left" size={24} style={{ paddingLeft: 10 }} />
              </TouchableOpacity>
            ),
          })}
        />

        <Stack.Screen
          name="OrderStack"
          component={OrderStack}
          options={({ navigation }) => ({
            headerShown: false,
            // title: "Quản lý đơn nhập hàng",
            // headerLeft: () => (
            //   <TouchableOpacity onPress={() => navigation.goBack()}>
            //     <Feather name="arrow-left" size={24} style={{ paddingLeft: 10 }} />
            //   </TouchableOpacity>
            // ),
          })}
        />

        <Stack.Screen
          name="PaymentStack"
          component={PaymentStack}
          options={({ navigation }) => ({
            headerShown: false,
            // title: "Quản lý đơn nhập hàng",
            // headerLeft: () => (
            //   <TouchableOpacity onPress={() => navigation.goBack()}>
            //     <Feather name="arrow-left" size={24} style={{ paddingLeft: 10 }} />
            //   </TouchableOpacity>
            // ),
          })}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};
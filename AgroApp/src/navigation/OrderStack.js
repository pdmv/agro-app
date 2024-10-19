import { createStackNavigator } from "@react-navigation/stack";
import { Text, TouchableOpacity, View } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import ProductList from "../screens/Product/ProductList";
import ProductDetail from "../screens/Product/ProductDetail";
import { getProductListThunk } from "../redux/productSlice";
import { useDispatch } from "react-redux";
import Color from "../themes/Color";
import CreateProduct from "../screens/Product/CreateProduct";
import SearchProduct from "../screens/Product/SearchProduct";
import OrderTab from "../screens/Order/OrderTab";
import OrderDetail from "../screens/Order/OrderDetail";
import SearchOrder from "../screens/Order/SearchOrder";

const Stack = createStackNavigator();

export default OrderStack = () => {
  const dispatch = useDispatch();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="OrderTab"
        component={OrderTab}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Đơn đặt hàng",
          headerTitleAlign: 'left',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} style={{ paddingLeft: 10 }} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
              <TouchableOpacity onPress={() => navigation.navigate("SearchOrder")} style={{ backgroundColor: Color.primary, borderRadius: 50, flexDirection: 'row', alignItems: 'center' }}>
                <Feather name="search" size={23} style={{ padding: 6, color: Color.white }} />
                <Text style={{ color: Color.white, marginRight: 8 }}>Tìm kiếm</Text>
              </TouchableOpacity>
            </View>
          ),
        })}
      />

      <Stack.Screen
        name="OrderDetail"
        component={OrderDetail}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Thông tin đơn hàng",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} style={{ paddingLeft: 10 }} />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="SearchOrder"
        component={SearchOrder}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Tìm kiếm đơn hàng",
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
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

const Stack = createStackNavigator();

export default ProductStack = () => {
  const dispatch = useDispatch();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="ProductList"
        component={ProductList}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Mặt hàng",
          headerTitleAlign: 'left',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} style={{ paddingLeft: 10 }} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "center", backgroundColor: Color.gray, marginRight: 8, borderRadius: 50, paddingHorizontal: 2, }}>
                <TouchableOpacity
                  onPress={() => {
                    dispatch(getProductListThunk());
                  }}
                  style={{ backgroundColor: Color.gray, borderRadius: 50 }}
                >
                  <Feather name="refresh-cw" size={23} style={{ padding: 6, color: Color.darkestGray }} />
                </TouchableOpacity>

                <View style={{ width: 1, height: 24, backgroundColor: Color.darkerGray, marginHorizontal: 3 }} />

                <TouchableOpacity onPress={() => navigation.navigate("CreateProduct")} style={{ backgroundColor: Color.gray, borderRadius: 50 }}>
                  <Feather name="plus" size={23} style={{ padding: 6, color: Color.darkestGray }} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate("SearchProduct")} style={{ backgroundColor: Color.primary, borderRadius: 50, flexDirection: 'row', alignItems: 'center' }}>
                <Feather name="search" size={23} style={{ padding: 6, color: Color.white }} />
                <Text style={{ color: Color.white, marginRight: 8 }}>Tìm kiếm</Text>
              </TouchableOpacity>
            </View>
          ),
        })}
      />

      <Stack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Thông tin mặt hàng",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} style={{ paddingLeft: 10 }} />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="CreateProduct"
        component={CreateProduct}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Tạo mặt hàng",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} style={{ paddingLeft: 10 }} />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="SearchProduct"
        component={SearchProduct}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Tìm kiếm",
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
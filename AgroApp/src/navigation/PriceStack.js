import { createStackNavigator } from "@react-navigation/stack";
import { Text, TouchableOpacity, View } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { useDispatch } from "react-redux";
import Color from "../themes/Color";
import PriceList from "../screens/Price/PriceList";
import CreatePrice from "../screens/Price/CreatePrice";
import SelectProduct from "../screens/PurchaseOrder/SelectProduct";
import { useContext } from "react";
import { PurchaseProductContext } from "../contexts/PurchaseProductContext";
import PriceDetail from "../screens/Price/PriceDetail";
import SearchPrice from "../screens/Price/SearchPrice";

const Stack = createStackNavigator();

export default PriceStack = () => {
  const dispatch = useDispatch();
  const { setSelectedProducts } = useContext(PurchaseProductContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="PriceList"
        component={PriceList}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Bảng giá",
          headerTitleAlign: 'left',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} style={{ paddingLeft: 10 }} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "center", backgroundColor: Color.gray, marginRight: 8, borderRadius: 50, paddingHorizontal: 2, }}>
                <TouchableOpacity onPress={() => navigation.navigate("CreatePrice")} style={{ backgroundColor: Color.gray, borderRadius: 50 }}>
                  <Feather name="plus" size={23} style={{ padding: 6, color: Color.darkestGray }} />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity
                onPress={() => navigation.navigate("SearchPrice")}
                style={{ backgroundColor: Color.primary, borderRadius: 50, flexDirection: 'row', alignItems: 'center' }}
              >
                <Feather name="search" size={23} style={{ padding: 6, color: Color.white }} />
                <Text style={{ color: Color.white, marginRight: 8 }}>Tìm kiếm</Text>
              </TouchableOpacity>
            </View>
          ),
        })}
      />

      <Stack.Screen
        name="CreatePrice"
        component={CreatePrice}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Đăng bán mặt hàng",
          headerLeft: () => (
            <TouchableOpacity onPress={() => {
              setSelectedProducts([]);
              navigation.goBack();
            }}>
              <Feather name="arrow-left" size={24} style={{ paddingLeft: 10 }} />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="SelectProduct"
        component={SelectProduct}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Chọn mặt hàng",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} style={{ paddingLeft: 10 }} />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="PriceDetail"
        component={PriceDetail}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Thông tin bảng giá",
          headerLeft: () => (
            <TouchableOpacity onPress={() => {
              navigation.goBack();
            }}>
              <Feather name="arrow-left" size={24} style={{ paddingLeft: 10 }} />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="SearchPrice"
        component={SearchPrice}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Tìm kiếm bảng giá",
          headerLeft: () => (
            <TouchableOpacity onPress={() => {
              navigation.goBack();
            }}>
              <Feather name="arrow-left" size={24} style={{ paddingLeft: 10 }} />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};
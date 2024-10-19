import { createStackNavigator } from "@react-navigation/stack";
import { Text, TouchableOpacity, View } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { getSupplierListThunk } from "../redux/supplierSlice";
import { useDispatch, useSelector } from "react-redux";
import Color from "../themes/Color";
import PurchaseOrderTab from "../screens/PurchaseOrder/PurchaseOrderTab";
import CreatePurchaseOrder from "../screens/PurchaseOrder/CreatePurchaseOrder";
import SelectSupplier from "../screens/PurchaseOrder/SelectSupplier";
import { useContext } from "react";
import { SupplierContext } from "../contexts/SupplierContext";
import SelectProduct from "../screens/PurchaseOrder/SelectProduct";
import { PurchaseProductContext } from "../contexts/PurchaseProductContext";
import PurchaseOrderDetail from "../screens/PurchaseOrder/PurchaseOrderDetail";
import SearchPurchaseOrder from "../screens/PurchaseOrder/SearchPurchaseOrder";

const Stack = createStackNavigator();

export default PurchaseOrderStack = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { setSelectedSupplier } = useContext(SupplierContext);
  const { setSelectedProducts } = useContext(PurchaseProductContext);


  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="PurchaseOrderTab"
        component={PurchaseOrderTab}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Đơn nhập hàng",
          headerTitleAlign: 'left',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} style={{ paddingLeft: 10 }} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "center", backgroundColor: Color.gray, marginRight: 8, borderRadius: 100, paddingHorizontal: 2, }}>
                <TouchableOpacity onPress={() => navigation.navigate("CreatePurchaseOrder")} style={{ backgroundColor: Color.gray, borderRadius: 50 }}>
                  <Feather name="plus" size={23} style={{ padding: 6, color: Color.darkestGray }} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate("SearchPurchaseOrder")} style={{ backgroundColor: Color.primary, borderRadius: 50, flexDirection: 'row', alignItems: 'center' }}>
                <Feather name="search" size={23} style={{ padding: 6, color: Color.white }} />
                <Text style={{ color: Color.white, marginRight: 8 }}>Tìm kiếm</Text>
              </TouchableOpacity>
            </View>
          ),
        })}
      />

      <Stack.Screen
        name="CreatePurchaseOrder"
        component={CreatePurchaseOrder}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Tạo đơn nhập hàng",
          headerLeft: () => (
            <TouchableOpacity onPress={() => {
              setSelectedSupplier(null);
              setSelectedProducts([]);
              navigation.goBack();
            }}>
              <Feather name="arrow-left" size={24} style={{ paddingLeft: 10 }} />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="SelectSupplier"
        component={SelectSupplier}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Chọn nhà cung cấp",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
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
        name="PurchaseOrderDetail"
        component={PurchaseOrderDetail}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Thông tin đơn nhập hàng",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} style={{ paddingLeft: 10 }} />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="SearchPurchaseOrder"
        component={SearchPurchaseOrder}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Tìm kiếm đơn nhập hàng",
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
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
import PaymentTab from "../screens/Payment/PaymentTab";
import PaymentCreate from "../screens/Payment/PaymentCreate";
import { PurchaseOrderContext } from "../contexts/PurchaseOrderContext";
import SelectPurchaseOrder from "../screens/Payment/SelectPurchaseOrder";
import PaymentDetail from "../screens/Payment/PaymentDetail";
import SearchPayment from "../screens/Payment/SearchPayment";

const Stack = createStackNavigator();

export default PaymentStack = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { setSelectedSupplier } = useContext(SupplierContext);
  const { setSelectedPurchases } = useContext(PurchaseOrderContext);


  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="PaymentTab"
        component={PaymentTab}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Hoá đơn",
          headerTitleAlign: 'left',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} style={{ paddingLeft: 10 }} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "center", backgroundColor: Color.gray, marginRight: 8, borderRadius: 100, paddingHorizontal: 2, }}>
                <TouchableOpacity onPress={() => navigation.navigate("CreatePayment")} style={{ backgroundColor: Color.gray, borderRadius: 50 }}>
                  <Feather name="plus" size={23} style={{ padding: 6, color: Color.darkestGray }} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate("SearchPayment")} style={{ backgroundColor: Color.primary, borderRadius: 50, flexDirection: 'row', alignItems: 'center' }}>
                <Feather name="search" size={23} style={{ padding: 6, color: Color.white }} />
                <Text style={{ color: Color.white, marginRight: 8 }}>Tìm kiếm</Text>
              </TouchableOpacity>
            </View>
          ),
        })}
      />

      <Stack.Screen
        name="CreatePayment"
        component={PaymentCreate}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Tạo hoá đơn thanh toán",
          headerLeft: () => (
            <TouchableOpacity onPress={() => {
              setSelectedSupplier(null);
              setSelectedPurchases([]);
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
        name="SelectPurchaseOrder"
        component={SelectPurchaseOrder}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Chọn đơn nhập hàng",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} style={{ paddingLeft: 10 }} />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="PaymentDetail"
        component={PaymentDetail}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Thông tin hoá đơn",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} style={{ paddingLeft: 10 }} />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="SearchPayment"
        component={SearchPayment}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Tìm kiếm hoá đơn",
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
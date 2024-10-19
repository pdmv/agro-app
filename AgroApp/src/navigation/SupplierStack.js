import { createStackNavigator } from "@react-navigation/stack";
import { Text, TouchableOpacity, View } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import SupplierList from "../screens/Supplier/SupplierList";
import SupplierDetail from "../screens/Supplier/SupplierDetail";
import CreateSupplier from "../screens/Supplier/CreateSupplier";
import { getSupplierListThunk } from "../redux/supplierSlice";
import { useDispatch, useSelector } from "react-redux";
import Color from "../themes/Color";
import SearchSupplier from "../screens/Supplier/SearchSupplier";

const Stack = createStackNavigator();

export default SupplierStack = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="SupplierList"
        component={SupplierList}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Nhà cung cấp",
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
                    dispatch(getSupplierListThunk(token));
                  }}
                  style={{ backgroundColor: Color.gray, borderRadius: 50 }}
                >
                  <Feather name="refresh-cw" size={23} style={{ padding: 6, color: Color.darkestGray }} />
                </TouchableOpacity>

                <View style={{ width: 1, height: 24, backgroundColor: Color.darkerGray, marginHorizontal: 3 }} />

                <TouchableOpacity onPress={() => navigation.navigate("CreateSupplier")} style={{ backgroundColor: Color.gray, borderRadius: 50 }}>
                  <Feather name="plus" size={23} style={{ padding: 6, color: Color.darkestGray }} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate("SearchSupplier")} style={{ backgroundColor: Color.primary, borderRadius: 50, flexDirection: 'row', alignItems: 'center' }}>
                <Feather name="search" size={23} style={{ padding: 6, color: Color.white }} />
                <Text style={{ color: Color.white, marginRight: 8 }}>Tìm kiếm</Text>
              </TouchableOpacity>
            </View>
          ),
        })}
      />

      <Stack.Screen
        name="SupplierDetail"
        component={SupplierDetail}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Thông tin nhà cung cấp",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} style={{ paddingLeft: 10 }} />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="CreateSupplier"
        component={CreateSupplier}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Tạo nhà cung cấp",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} style={{ paddingLeft: 10 }} />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="SearchSupplier"
        component={SearchSupplier}
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
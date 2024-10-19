import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import Feather from '@expo/vector-icons/Feather';
import Color from "../themes/Color";
import ProfileStack from "./ProfileStack";
import { useSelector } from "react-redux";
import LoadingModal from "../common/LoadingModal";
import UsersStack from "./UsersStack";
import CartScreen from "../screens/CartScreen";
import PriceScreen from "../screens/PriceScreen";
import InventoryScreen from "../screens/InventoryScreen";
import FunctionsScreen from "../screens/Functions/FunctionsScreen";
import CustomerOrderList from "../screens/CustomerOrderList";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

export default MainTabs = () => {
  const navigation = useNavigation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!user && isAuthenticated) {
    return <LoadingModal visible={true} />
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Color.primary,
        tabBarInactiveTintColor: "lightgray",
        tabBarStyle: {
          backgroundColor: '#fff',
        },

        tabBarIcon: ({ color, size }) => {
          let iconName;
          let iconSize = 22;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'UsersStack') {
            iconName = 'users';
          } else if (route.name === 'ProfileStack') {
            iconName = 'user';
          } else if (route.name === 'Cart') {
            iconName = 'shopping-bag';
          } else if (route.name === 'Price') {
            iconName = 'dollar-sign';
          } else if (route.name === 'Inventory') {
            iconName = 'archive';
          } else if (route.name === 'Functions') {
            iconName = 'briefcase';
          } else if (route.name === 'CustomerOrderList') {
            iconName = 'book';
          }

          return <Feather name={iconName} size={iconSize} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Trang chủ",
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Price"
        component={PriceScreen}
        options={{
          tabBarLabel: "Bảng giá",
          headerShown: true,
          headerTitle: "Bảng giá",
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
              <TouchableOpacity
                onPress={() => navigation.navigate("PriceStack", {
                  screen: "SearchPrice"
                })}
                style={{ backgroundColor: Color.primary, borderRadius: 50, flexDirection: 'row', alignItems: 'center' }}
              >
                <Feather name="search" size={23} style={{ padding: 6, color: Color.white }} />
                <Text style={{ color: Color.white, marginRight: 8 }}>Tìm kiếm</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      {(user === null || user === undefined || (user && user?.account.role === "CUSTOMER")) && (
        <>
          <Tab.Screen
            name="Cart"
            component={CartScreen}
            options={{
              tabBarLabel: "Giỏ hàng",
              headerShown: true,
              headerTitle: "Giỏ hàng",
            }}
          />

          <Tab.Screen
            name="CustomerOrderList"
            component={CustomerOrderList}
            options={{
              tabBarLabel: "Đơn hàng",
              headerShown: true,
              headerTitle: "Đơn hàng",
            }}
          />
        </>
      )}

      {(user !== null || user !== undefined) && user?.account.role !== undefined && user?.account.role !== 'CUSTOMER' && (
        <>
          <Tab.Screen
            name="Inventory"
            component={InventoryScreen}
            options={{
              tabBarLabel: "Kho",
              headerShown: true,
              headerTitle: "Kho",
            }}
          />

          <Tab.Screen
            name="Functions"
            component={FunctionsScreen}
            options={{
              tabBarLabel: "Chức năng",
              headerShown: true,
              headerTitle: "Chức năng",
            }}
          />
        </>
      )}

      {(user !== null || user!== undefined) && user?.account.role === 'ADMIN' && (
        <Tab.Screen
          name="UsersStack"
          component={UsersStack}
          options={{
            tabBarLabel: "Người dùng",
            headerShown: false,
          }}
        />
      )}

      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          tabBarLabel: "Hồ sơ",
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};
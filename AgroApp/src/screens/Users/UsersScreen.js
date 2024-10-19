import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Color from "../../themes/Color";
import ListUserScreen from "./ListUserScreen";
import { useSelector } from 'react-redux';

const Tab = createMaterialTopTabNavigator();

const UsersScreen = () => {
  const { adminUsers, ownerUsers, staffUsers, customerUsers } = useSelector(state => state.users);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarIndicatorStyle: {
          backgroundColor: Color.primary,
        },
        tabBarLabelStyle: {
          textTransform: 'none',
          fontSize: 15,
          color: Color.primary,
        },
        tabBarItemStyle: {
          width: 'auto',
          marginHorizontal: 10,
          justifyContent: 'center'
        },
      }}
    >
      <Tab.Screen
        name="Quản trị viên"
        children={() => <ListUserScreen users={adminUsers} />}
      />
      <Tab.Screen
        name="Chủ cửa hàng"
        children={() => <ListUserScreen users={ownerUsers} />}
      />
      <Tab.Screen
        name="Nhân viên"
        children={() => <ListUserScreen users={staffUsers} />}
      />
      <Tab.Screen
        name="Khách hàng"
        children={() => <ListUserScreen users={customerUsers} />}
      />
    </Tab.Navigator>
  );
};

export default UsersScreen;
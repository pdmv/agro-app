import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Color from "../../themes/Color";
import PaymentList from './PaymentList';
// import TodayTab from './TodayTab';

const Tab = createMaterialTopTabNavigator();

const status = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED',
}

const PaymentTab = () => {

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
          justifyContent: 'center',
        },
        lazy: true,
      }}
    >
      <Tab.Screen
        name="Pending"
        options={{
          tabBarLabel: 'Chờ thanh toán',
        }}
        children={() => <PaymentList status={status.PENDING} />}
      />

      <Tab.Screen
        name="Paid"
        options={{
          tabBarLabel: 'Đã thanh toán',
        }}
        children={() => <PaymentList status={status.PAID} />}
      />

      <Tab.Screen
        name="Cancelled"
        options={{
          tabBarLabel: 'Đã huỷ',
        }}
        children={() => <PaymentList status={status.CANCELLED} />}
      />
    </Tab.Navigator>
  );
};

export default PaymentTab;
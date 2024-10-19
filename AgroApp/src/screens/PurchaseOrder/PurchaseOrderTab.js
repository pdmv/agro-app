import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Color from "../../themes/Color";
import TodayTab from './TodayTab';
import PendingTab from './PendingTab';
import YesterdayTab from './YesterdayTab';
import ImportedTab from './ImportedTab';
import InPaymentTab from './InPayment';
import CancelledTab from './CancelledTab';
import PriceEnteredTab from './PriceEnteredTab';

const Tab = createMaterialTopTabNavigator();

const PurchaseOrderTab = () => {

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
        name="Today"
        options={{
          tabBarLabel: 'Hôm nay',
        }}
        component={TodayTab}
      />

      <Tab.Screen
        name="Yesterday"
        options={{
          tabBarLabel: 'Hôm qua',
        }}
        component={YesterdayTab}
      />

      <Tab.Screen
        name="Pending"
        options={{
          tabBarLabel: 'Chờ nhập hàng',
        }}
        component={PendingTab}
      />

      <Tab.Screen
        name="Imported"
        options={{
          tabBarLabel: 'Chờ nhập giá',
        }}
        component={ImportedTab}
      />

      <Tab.Screen
        name="PriceEntered"
        options={{
          tabBarLabel: 'Chờ thanh toán',
        }}
        component={PriceEnteredTab}
      />

      <Tab.Screen
        name="InPayment"
        options={{
          tabBarLabel: 'Thanh toán',
        }}
        component={InPaymentTab}
      />

      <Tab.Screen
        name="Cancelled"
        options={{
          tabBarLabel: 'Đã huỷ',
        }}
        component={CancelledTab}
      />
    </Tab.Navigator>
  );
};

export default PurchaseOrderTab;
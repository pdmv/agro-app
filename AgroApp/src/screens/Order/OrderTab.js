import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Color from "../../themes/Color";
import OrderList from './OrderList';
import { TouchableOpacity, View } from 'react-native';

const Tab = createMaterialTopTabNavigator();

export const OrderStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  SHIPPING: 'SHIPPING',
  DELIVERED: 'DELIVERED',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED',
}

export const OrderStatusString = (status) => {
  switch (status) {
    case OrderStatus.PENDING:
      return 'Chờ xác nhận';
    case OrderStatus.CONFIRMED:
      return 'Đã xác nhận';
    case OrderStatus.SHIPPING:
      return 'Đang giao hàng';
    case OrderStatus.DELIVERED:
      return 'Đã giao hàng';
    case OrderStatus.PAID:
      return 'Đã thanh toán';
    case OrderStatus.CANCELLED:
      return 'Đã hủy';
    default:
      return '';
  }
}

const OrderTab = () => {
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
        lazy: true,
      }}
    >
      <Tab.Screen
        name="Pending"
        children={() => <OrderList statusString={OrderStatus.PENDING} />}
        options={{
          tabBarLabel: 'Chờ xác nhận',
        }}
      />
      <Tab.Screen
        name="Confirmed"
        children={() => <OrderList statusString={OrderStatus.CONFIRMED} />}
        options={{
          tabBarLabel: 'Đã xác nhận',
        }}
      />
      <Tab.Screen
        name="Shipping"
        children={() => <OrderList statusString={OrderStatus.SHIPPING} />}
        options={{
          tabBarLabel: 'Đang giao hàng',
        }}
      />
      <Tab.Screen
        name="Delivered"
        children={() => <OrderList statusString={OrderStatus.DELIVERED} />}
        options={{
          tabBarLabel: 'Đã giao hàng',
        }}
      />
      <Tab.Screen
        name="Paid"
        children={() => <OrderList statusString={OrderStatus.PAID} />}
        options={{
          tabBarLabel: 'Đã thanh toán',
        }}
      />
      <Tab.Screen
        name="Cancelled"
        children={() => <OrderList statusString={OrderStatus.CANCELLED} />}
        options={{
          tabBarLabel: 'Đã hủy',
        }}
      />
    </Tab.Navigator>
  );
};

export default OrderTab;

export const PaymentMethod = {
  CASH: 'CASH',
  E_WALLET: 'E_WALLET',
  BANK_TRANSFER: 'BANK_TRANSFER'
}

export const PaymentMethodString = (method) => {
  switch (method) {
    case PaymentMethod.CASH:
      return 'Tiền mặt';
    case PaymentMethod.E_WALLET:
      return 'Ví điện tử';
    case PaymentMethod.BANK_TRANSFER:
      return 'Chuyển khoản';
    default:
      return '';
  }
}
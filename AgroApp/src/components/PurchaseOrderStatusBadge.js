import { StyleSheet, Text, View } from "react-native";
import Color from "../themes/Color";

const statusBadge = (statusString) => {
  if (statusString === 'PENDING') {
    return {
      text: 'Chờ nhập hàng',
      color: Color.warning,
    }
  }
  if (statusString === 'IMPORTED') {
    return {
      text: 'Đã nhập hàng',
      color: Color.error,
    }
  }
  if (statusString === 'PRICE_ENTERED') {
    return {
      text: 'Đã nhập giá',
      color: Color.normal,
    }
  }
  if (statusString === 'IN_PAYMENT') {
    return {
      text: 'Thanh toán',
      color: Color.standby,
    }
  }
  if (statusString === 'CANCELLED') {
    return {
      text: 'Đã hủy',
      color: Color.unavailable,
    }
  }
};

const PurchaseOrderStatusBadge = ({ status }) => {
  return (
    <View style={[styles.container,  { backgroundColor: statusBadge(status).color }]}>
      <Text style={styles.text}>{ statusBadge(status).text }</Text>
    </View>
  );
};

export default PurchaseOrderStatusBadge;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  text: {
    color: Color.white,
    paddingVertical: 4,
    paddingHorizontal: 5,
    fontSize: 12,
    fontWeight: 'bold',
  }
});

// PENDING, IMPORTED, PRICE_ENTERED, IN_PAYMENT, CANCELLED
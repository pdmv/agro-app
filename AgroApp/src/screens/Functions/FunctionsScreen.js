import { ScrollView, StyleSheet, Text, View } from "react-native";
import Color from "../../themes/Color";
import FunctionNav from "../../components/FunctionNav";
import { useNavigation } from "@react-navigation/native";

const FunctionsScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <FunctionNav title="Mặt hàng" leftIcon="monitor" rightIcon="chevron-right" onPress={() => navigation.navigate("Product")}  />
      <FunctionNav title="Nhà cung cấp" leftIcon="monitor" rightIcon="chevron-right" onPress={() => navigation.navigate("Supplier")} />
      <FunctionNav title="Đơn nhập hàng" leftIcon="monitor" rightIcon="chevron-right" onPress={() => navigation.navigate("PurchaseOrderStack")} />
      <FunctionNav title="Hoá đơn thanh toán" leftIcon="monitor" rightIcon="chevron-right" onPress={() => navigation.navigate("PaymentStack")} />
      <FunctionNav title="Bảng giá" leftIcon="monitor" rightIcon="chevron-right" onPress={() => navigation.navigate("PriceStack")} />
      <FunctionNav title="Đơn đặt hàng" leftIcon="monitor" rightIcon="chevron-right" onPress={() => navigation.navigate("OrderStack")} />
    </ScrollView>
  );
};

export default FunctionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
    padding: 16,
  }
});
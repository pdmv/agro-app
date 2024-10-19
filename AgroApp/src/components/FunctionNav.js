import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import Color from "../themes/Color";
import PurchaseOrderStatusBadge from "./PurchaseOrderStatusBadge";
import PurchaseCreatedBadge from "./PurchaseCreatedAtBadge";

export default FunctionNav = ({ title, leftIcon, rightIcon, onPress, purchaseCreatedAt }) => {
  return (
    <TouchableOpacity style={styles.function} onPress={onPress}>
      <View style={styles.title}>
        <Feather name={leftIcon} size={22} color={Color.black} style={{ marginRight: 10 }} />
        <View style={styles.content}>
          <Text style={styles.functionText}>{title}</Text>
          {purchaseCreatedAt && (
            <PurchaseCreatedBadge createdAt={purchaseCreatedAt} />
          )}
        </View>
      </View>
      <Feather name={rightIcon} size={24} color={Color.darkestGray} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  function: {
    backgroundColor: Color.white,
    height: 60,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 18,
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: Color.darkerGray,
  },
  functionText: {
    fontSize: 16,
    color: Color.black,
    marginRight: 5,
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  }
});
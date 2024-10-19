import { StyleSheet, Text, View } from "react-native";
import Color from "../themes/Color";
import { fromNow } from "../utils/dateUtils";

const PurchaseCreatedBadge = ({ createdAt }) => {
  return (
    <View style={[styles.container]}>
      <Text style={styles.text}>{fromNow(createdAt)}</Text>
    </View>
  );
};

export default PurchaseCreatedBadge;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: Color.black,
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
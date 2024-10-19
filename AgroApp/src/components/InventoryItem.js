import { StyleSheet, Text, View } from "react-native";
import Color from "../themes/Color";

const InventoryItem = ({ productName, quantity }) => {
  return (
    <View style={styles.inventoryItem}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Tên mặt hàng</Text>
        <Text style={styles.value}>{productName}</Text>
      </View>

      <View style={styles.horizontalLine} />

      <View style={styles.wrapper}>
        <Text style={styles.title}>Số lượng tồn kho (kg)</Text>
        <Text style={styles.value}>{quantity.toFixed(1)}</Text>
      </View>
    </View>
  );
};

export default InventoryItem;

const styles = StyleSheet.create({
  inventoryItem: {
    borderWidth: 1,
    borderColor: Color.darkerGray,
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  title: {
    fontSize: 16,
    color: Color.black,
  },
  value: {
    fontSize: 16,
    color: Color.black,
    fontWeight: 'bold',
  },
  horizontalLine: {
    borderBottomColor: Color.darkerGray,
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});
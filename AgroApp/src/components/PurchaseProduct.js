import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Color from "../themes/Color";

const PurchaseProduct = ({ product, onChange, handleDelete }) => {
  return (
    <View style={styles.productWrapper}>
      <View style={[styles.productContent]}>
        <Text style={styles.productTitle}>Tên mặt hàng</Text>
        <Text style={styles.value}>{product.productName}</Text>
      </View>

      <View style={styles.horizontalLine} />

      <View style={styles.productContent}>
        <Text style={styles.productTitle}>Số lượng (kg)</Text>
        <TextInput
          style={styles.value}
          placeholder="10.0"
          keyboardType="numeric"
          value={product.quantity.toString()}
          onChangeText={(text) => onChange(product.productId, 'quantity', text)}
        />
      </View>

      <View style={styles.horizontalLine} />

      <View style={styles.productContent}>
        <Text style={styles.productTitle}>Giá đề nghị (VNĐ)</Text>
        <TextInput
          style={styles.value}
          placeholder="10.0"
          keyboardType="numeric"
          value={product.expectedPrice.toString()}
          onChangeText={(text) => onChange(product.productId, 'expectedPrice', text)}
        />
      </View>

      <View style={styles.horizontalLine} />

      <TouchableOpacity style={styles.deleteWrapper} onPress={() => handleDelete(product.productId)}>
        <Text style={styles.deleteText}>Bỏ chọn</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PurchaseProduct;

const styles = StyleSheet.create({
  productWrapper: {
    borderWidth: 1,
    borderColor: Color.darkerGray,
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 16,
  },
  productContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productTitle: {
    fontSize: 16,
    color: Color.black,
  },
  value: {
    fontSize: 16,
    color: Color.black,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  deleteWrapper: {
    backgroundColor: Color.gray,
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
    marginBottom: 0,
  },
  deleteText: {
    color: Color.darkestGray,
    fontWeight: '600',
  },
  horizontalLine: {
    borderBottomColor: Color.darkerGray,
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});
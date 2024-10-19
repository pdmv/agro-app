import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Color from "../themes/Color";
import { fromNow } from "../utils/dateUtils";
import PurchaseOrderStatusBadge from "./PurchaseOrderStatusBadge";
import { useEffect } from 'react'

const PurchaseOrderContainer = ({ purchase, handleDelete }) => {
  return (
    <View style={styles.productWrapper}>
      <View style={[styles.productContent]}>
        <Text style={styles.productTitle}>Mã đơn nhập hàng</Text>
        <Text style={styles.value}>{purchase.id}</Text>
      </View>

      <View style={styles.horizontalLine} />

      <View style={[styles.productContent]}>
        <Text style={styles.productTitle}>Tổng tiền</Text>
        <Text style={styles.value}>{purchase.totalAmount.toLocaleString('vi-VN')}</Text>
      </View>

      <View style={styles.horizontalLine} />

      <View style={[styles.productContent]}>
        <Text style={styles.productTitle}>Tạo lúc</Text>
        <Text style={styles.value}>{fromNow(purchase.createdAt)}</Text>
      </View>

      <View style={styles.horizontalLine} />

      <View style={[styles.productContent]}>
        <Text style={styles.productTitle}>Trạng thái</Text>
        <PurchaseOrderStatusBadge status={purchase.status} />
      </View>

      <View style={styles.horizontalLine} />

      <TouchableOpacity style={styles.deleteWrapper} onPress={() => handleDelete(purchase.id)}>
        <Text style={styles.deleteText}>Bỏ chọn</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PurchaseOrderContainer;

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
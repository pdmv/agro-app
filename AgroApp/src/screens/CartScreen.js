import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import Color from "../themes/Color";
import { useDispatch, useSelector } from "react-redux";
import CartItem from "../components/CartItem";
import { decrementQuantity, incrementQuantity, removeFromCart } from "../redux/cartSlice";
import { useNavigation } from "@react-navigation/native";

const productPrimary = require('../../assets/Images/productPrimary.png');

const CartScreen = () => {
  const navigation = useNavigation();
  const cartItems = useSelector(state => state.cart.items);
  const totalPrice = useSelector(state => state.cart.totalPrice);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.productList} contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 16 }}>
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
          />
        ))}
      </ScrollView>

      <View style={styles.bottomWrapper}>
        <View style={styles.totalAmount}>
          <Text style={styles.totalText}>Tổng tiền</Text>
          <Text style={styles.totalPrice}>{totalPrice.toLocaleString('vi-VN')} VNĐ</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.orderWrapper,
            { opacity: user && cartItems.length > 0 ? 1 : 0.5 },
          ]}
          onPress={() => {
            if (user && cartItems.length > 0) {
              navigation.navigate("OrderScreen");
            }
          }}
          disabled={!user || cartItems.length === 0}
        >
          <View style={styles.orderBtn}>
            <Text style={styles.orderText}>Đặt hàng</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: Color.darkerGray,
    borderRadius: 20,
    padding: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  productInfo: {
    marginLeft: 10,
  },
  productName: {
    fontSize: 16,
    color: Color.black,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    color: Color.black,
  },
  quantityWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Color.darkerGray,
    borderRadius: 5,
    padding: 6,
    marginTop: 10,
  },
  verticalLine: {
    height: 20,
    width: 1,
    backgroundColor: Color.darkerGray,
    marginHorizontal: 6,
  },
  minusIcon: {

  },
  quantityText: {
    fontSize: 16,
  },
  plusIcon: {

  },
  deleteWrapper: {
    marginLeft: 10,
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: Color.gray,
    borderRadius: 10,
    padding: 2,
  },
  deleteIcon: {
    color: Color.darkestGray,
  },

  bottomWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Color.darkerGray,
    backgroundColor: Color.white,
  },
  totalAmount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  totalText: {
    fontSize: 16,
    color: Color.black,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Color.black,
  },
  orderWrapper: {
    marginBottom: 10,
  },
  orderBtn: {
    backgroundColor: Color.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  orderText: {
    fontSize: 16,
    color: Color.white,
    fontWeight: 'bold',
  },
});
import React, { useState, useRef } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import Color from "../themes/Color";
import { useDispatch, useSelector } from "react-redux";
import { decrementQuantity, incrementQuantity, removeFromCart, setQuantity } from "../redux/cartSlice";
import { TextInput } from "react-native-gesture-handler";

const CartItem = ({ item }) => {
  const [intervalId, setIntervalId] = useState(null);
  const dispatch = useDispatch();

  const startContinuousChange = (action) => {
    action();

    // Start continuous update on hold
    const id = setInterval(() => {
      action();
    }, 200);

    setIntervalId(id);
  };

  const stopContinuousChange = () => {
    clearInterval(intervalId);
    setIntervalId(null);
  };

  return (
    <View style={styles.productContainer}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price.toLocaleString('vi-VN')} VNĐ</Text>

        <View style={styles.quantityWrapper}>
          {/* Holdable minus button */}
          <TouchableOpacity
            onPressIn={() => startContinuousChange(() => dispatch(decrementQuantity(item.id)))}
            onPressOut={stopContinuousChange}
          >
            <Feather name="minus" size={20} style={styles.minusIcon} />
          </TouchableOpacity>

          <View style={styles.verticalLine} />

          <TextInput
            style={styles.quantityText}
            value={item.quantity.toString()}
            onChangeText={(value) => {
              console.log(value)
              const numericValue = parseFloat(value);
              if (!isNaN(numericValue) && numericValue >= 0) {
                dispatch(setQuantity({ id: item.id, quantity: numericValue }));
              } else if (value === '') {
                dispatch(setQuantity({ id: item.id, quantity: 0 }));
              }
            }}
            keyboardType="numeric"
          />

          <View style={styles.verticalLine} />

          {/* Holdable plus button */}
          <TouchableOpacity
            onPressIn={() => startContinuousChange(() => dispatch(incrementQuantity(item.id)))}
            onPressOut={stopContinuousChange}
          >
            <Feather name="plus" size={20} style={styles.plusIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.deleteWrapper} onPress={() => dispatch(removeFromCart(item.id))}>
        <Feather name="x" size={16} style={styles.deleteIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    // marginHorizontal: 20,
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
    color: Color.black,
  },
  quantityText: {
    fontSize: 16,
    color: Color.black,
    marginHorizontal: 15,
  },
  plusIcon: {
    color: Color.black,
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
});
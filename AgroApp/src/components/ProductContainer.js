import React, { useState, useRef } from "react";
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import Color from "../themes/Color";
import { useDispatch, useSelector } from "react-redux";
import { combineSlices } from "@reduxjs/toolkit";
import { addToCart, resetCart } from "../redux/cartSlice";
import { useNavigation } from "@react-navigation/native";

const productPrimary = require('../../assets/Images/productPrimary.png');

const ProductContainer = ({ image, name, price, handleAddToCart, handleBuy }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const formattedPrice = parseFloat(price).toLocaleString('vi-VN');

  const fadeAnimShoppingBag = useRef(new Animated.Value(1)).current;
  const fadeAnimCheck = useRef(new Animated.Value(0)).current;

  const triggerAddToCartAnimation = () => {
    handleAddToCart();

    // Start the fade-out and fade-in sequence for the shopping bag and checkmark
    Animated.sequence([
      // Step 1: Fade out shopping bag
      Animated.timing(fadeAnimShoppingBag, { toValue: 0, duration: 400, useNativeDriver: true }),

      // Step 2: Fade in checkmark
      Animated.timing(fadeAnimCheck, { toValue: 1, duration: 400, useNativeDriver: true }),

      // Step 3: Hold checkmark for 1 second
      Animated.delay(1000),

      // Step 4: Fade out checkmark
      Animated.timing(fadeAnimCheck, { toValue: 0, duration: 400, useNativeDriver: true }),

      // Step 5: Fade shopping bag back in
      Animated.timing(fadeAnimShoppingBag, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={styles.productContainer}>
      <Image source={image ? image : productPrimary} style={styles.productImage} />
      <Text style={styles.productName}>{name}</Text>
      <Text style={styles.productPrice}>{formattedPrice} VNĐ</Text>

      {(user === null || user === undefined || (user && user?.account.role === "CUSTOMER")) && (
        <>
          <View style={styles.btnWrapper}>
            <TouchableOpacity style={styles.buyBtn} onPress={handleBuy}>
              <Text style={styles.buyBtnText}>Mua</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addToCartBtn} onPress={triggerAddToCartAnimation}>
              {/* Shopping bag icon */}
              <Animated.View style={[styles.iconWrapper, { opacity: fadeAnimShoppingBag }]}>
                <Feather name="shopping-bag" size={22} style={styles.addToCartIcon} />
              </Animated.View>

              {/* Checkmark icon */}
              <Animated.View style={[styles.iconWrapper, { opacity: fadeAnimCheck }]}>
                <Feather name="check" size={22} style={styles.addToCartIcon} />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default ProductContainer;

const styles = StyleSheet.create({
  productContainer: {
    backgroundColor: Color.white,
    borderWidth: 1,
    borderColor: Color.darkerGray,
    alignSelf: 'center',
    borderRadius: 16,
    padding: 5,
    marginTop: 10,
  },
  productImage: {
    height: 180,
    width: 180,
    borderRadius: 11,
  },
  productName: {
    fontSize: 16,
    color: Color.black,
    fontWeight: 'bold',
    paddingTop: 15,
    paddingHorizontal: 10,
  },
  productPrice: {
    fontSize: 16,
    color: Color.black,
    padding: 10,
  },
  btnWrapper: {
    flexDirection: 'row',
    marginTop: 6,
  },
  buyBtn: {
    backgroundColor: Color.primary,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    width: 133,
    marginRight: 5,
  },
  buyBtnText: {
    color: Color.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  addToCartBtn: {
    backgroundColor: Color.darkerGray,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 42,
    height: 35,
  },
  addToCartIcon: {
    color: Color.black,
  },
  iconWrapper: {
    position: 'absolute',
  },
});
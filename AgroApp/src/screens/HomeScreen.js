import { Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, RefreshControl } from "react-native";
import Color from "../themes/Color";
import ProductContainer from "../components/ProductContainer";
import MenuItem from "../components/MenuItem";
import React, { useEffect, useState } from "react";
import { resetError, resetStatus, getListThunk } from "../redux/priceSlice";
import { useDispatch, useSelector } from "react-redux";
import LoadingModal from "../common/LoadingModal";
import { addToCart } from "../redux/cartSlice";
import { useNavigation } from "@react-navigation/native";

const appIcon = require('../../assets/Images/app_icon.png');

export default HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { error, status, list } = useSelector((state) => state.prices);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getListThunk());
  }, []);

  useEffect(() => {
    let timeoutId;

    if (status === 'loading') {
      setLoading(true);
    } else if (status === 'succeeded') {
      timeoutId = setTimeout(() => {
        setLoading(false);
        setRefreshing(false); // Stop refreshing after success
      }, 1000);
    } else if (status === 'failed') {
      timeoutId = setTimeout(() => {
        setLoading(false);
        setRefreshing(false); // Stop refreshing after failure
        setShowErrorModal(true);
      }, 1000);
    } else {
      setLoading(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [status]);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getListThunk());
  };

  const handleOk = () => {
    setShowErrorModal(false);
    dispatch(resetError());
    dispatch(resetStatus());
  };

  const handleAddToCart = ({ item }) => {
    const product = {
      id: item.id,
      name: item.itemName,
      price: parseFloat(item.price),
      image: item.productPrimaryImage,
    };
    dispatch(addToCart(product));
  };

  const handleBuy = ({ item }) => {
    handleAddToCart({ item });
    navigation.navigate("OrderScreen");
  }

  return (
    <SafeAreaView style={[styles.container, {
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    }]}>
      <View style={[styles.container, { backgroundColor: Color.gray }]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>Xin chào!</Text>
            {(user === null || user === undefined) && (
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.headerTitle}>Đăng nhập ở đây!</Text>
              </TouchableOpacity>
            )}

            {(user !== null && user !== undefined) && (
              <Text style={styles.headerTitle}>{user.lastname} {user.firstname}</Text>
            )}
          </View>
          <View style={styles.headerImageWrapper}>
            {(user === null || user === undefined) && (
              <Image source={appIcon} style={styles.headerImage} />
            )}
            {(user !== null && user !== undefined) && (
              <Image source={{ uri: user.account.avatarUrl }} style={styles.headerImage} />
            )}
          </View>
        </View>

        <View style={styles.menuContainer}>
          <MenuItem
            icon="dollar-sign"
            text="Bảng giá"
            handlePress={() => {
              if (user !== null && user !== undefined && user?.account.role !== "CUSTOMER") {
                navigation.navigate("PriceStack")
              } else {
                navigation.navigate("Price")
              }
            }}
          />

          <View style={styles.verticalLine} />

          {(user === null || user === undefined || (user && user?.account.role === "CUSTOMER")) && (
            <>
              <MenuItem icon="shopping-bag" text="Giỏ hàng" handlePress={() => navigation.navigate("Cart")} />
              <View style={styles.verticalLine} />
            </>
          )}

          {(user !== null && user !== undefined && (user && user?.account.role !== "CUSTOMER")) && (
            <>
              <MenuItem icon="archive" text="Kho" handlePress={() => navigation.navigate("Inventory")} />
              <View style={styles.verticalLine} />
            </>
          )}

          <MenuItem
            icon="book"
            text="Đơn hàng"
            handlePress={() => {
              if (user !== null && user !== undefined && user?.account.role !== "CUSTOMER") {
                navigation.navigate("OrderStack")
              } else {
                navigation.navigate("CustomerOrderList")
              }
            }}
          />

          <View style={styles.verticalLine} />

          <MenuItem icon="user" text="Hồ sơ" handlePress={() => navigation.navigate("ProfileStack")} />
        </View>

        <View style={styles.content}>
          <View style={styles.contentHeader}>
            <Text style={styles.contentHeaderText}>Bảng giá</Text>
          </View>

          <View style={styles.horizontalLine} />

          <ScrollView
            contentContainerStyle={styles.productList}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {list && list.map((item) => (
              <ProductContainer
                key={item.id}
                name={item.itemName}
                price={item.price.toFixed(0)}
                image={{ uri: item.productPrimaryImage }}
                handleAddToCart={() => handleAddToCart({ item })}
                handleBuy={() => handleBuy({ item })}
              />
            ))}
          </ScrollView>
        </View>
      </View>

      {error && showErrorModal && (
        <ErrorModal
          errorCode={error.code}
          msg={error.message}
          visible={showErrorModal}
          onPress={handleOk}
        />
      )}

      {loading && <LoadingModal visible={loading} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },

  header: {
    backgroundColor: Color.white,
    width: "100%",
    height: 70,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  welcome: {
    fontSize: 14,
    color: Color.black,
    marginLeft: 25,
    marginBottom: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Color.black,
    marginLeft: 25,
    marginBottom: 13,
  },
  headerImageWrapper: {
    marginRight: 10,
    marginBottom: 10,
  },
  headerImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },

  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: Color.white,
    padding: 15,
    alignSelf: 'center',
    borderRadius: 15,
  },
  verticalLine: {
    height: 50,
    width: 1,
    backgroundColor: Color.darkerGray,
    marginHorizontal: 15,
  },

  content: {
    flex: 1,
    backgroundColor: Color.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  contentHeader: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentHeaderText: {
    fontSize: 20,
    fontWeight: '400',
    color: Color.black,
  },
  horizontalLine: {
    height: 1,
    backgroundColor: Color.darkerGray,
    marginHorizontal: 15,
  },

  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
});
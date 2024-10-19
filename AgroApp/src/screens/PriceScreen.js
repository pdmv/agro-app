import { ScrollView, StyleSheet, View, RefreshControl } from "react-native";
import Color from "../themes/Color";
import ProductContainer from "../components/ProductContainer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addToCart, resetCart } from "../redux/cartSlice";
import { getListThunk, resetError, resetStatus } from "../redux/priceSlice";
import LoadingModal from "../common/LoadingModal";
import ErrorModal from "../common/ErrorModal";
import { useNavigation } from "@react-navigation/native";

const PriceScreen = () => {
  const navigation = useNavigation();
  const { list, status, error } = useSelector((state) => state.prices);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (status === 'loading') {
      setLoading(true);
    } else if (status === 'succeeded') {
      timeoutId = setTimeout(() => {
        setLoading(false);
        setRefreshing(false);
      }, 1000);
    } else if (status === 'failed') {
      timeoutId = setTimeout(() => {
        setLoading(false);
        setRefreshing(false);
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

  useEffect(() => {
    if (!list || list.length === 0) {
      dispatch(getListThunk());
    }
  }, [dispatch, list]);

  const handleAddToCart = ({ item }) => {
    const product = {
      id: item.id,
      name: item.itemName,
      price: parseFloat(item.price),
      image: item.productPrimaryImage,
    };
    dispatch(addToCart(product));
  };

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getListThunk());
  };

  const handleOk = () => {
    setShowErrorModal(false);
    dispatch(resetError());
    dispatch(resetStatus());
  };

  const handleBuy = ({ item }) => {
    handleAddToCart({ item });
    navigation.navigate("OrderScreen");
  }

  return (
    <View style={styles.container}>
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

      {/* Hiển thị lỗi nếu có */}
      {error && showErrorModal && (
        <ErrorModal
          errorCode={error.code}
          msg={error.message}
          visible={showErrorModal}
          onPress={handleOk}
        />
      )}

      {loading && <LoadingModal visible={loading} />}
    </View>
  );
};

export default PriceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },

  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
});
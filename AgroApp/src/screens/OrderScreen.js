import { Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Color from "../themes/Color";
import { authApi, endpoints } from "../services/api";
import ErrorModal from "../common/ErrorModal";
import LoadingModal from "../common/LoadingModal";
import InfoModal from "../common/InfoModal";
import CartItem from "../components/CartItem";
import { resetCart } from "../redux/cartSlice";

const OrderScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);
  const totalPrice = useSelector(state => state.cart.totalPrice);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const cartItems = useSelector(state => state.cart.items);

  const [shippingAddress, setShippingAddress] = useState(user?.address);
  const [shippingPhone, setShippingPhone] = useState(user?.phoneNumber);
  const [note, setNote] = useState('');

  const handleOk = () => {
    setShowErrorModal(false);
    setError(null);
  }

  const handleInfoOk = () => {
    dispatch(resetCart());
    setShowInfoModal(false);
    navigation.goBack();
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setShowInfo(true);
    }
  }, []);

  const handleToLogin = () => {
    setShowInfo(false);
    navigation.navigate("Home");
  };

  const handleCreate = async () => {
    if (cartItems.length === 0) {
      setError({ message: "Vui lòng chọn ít nhất một sản phẩm!", code: 400 });
      setShowErrorModal(true);
      return;
    }

    try {
      const details = cartItems.map((item) => ({
        priceId: item.id,
        quantity: item.quantity,
      }));

      const data = {
        shippingAddress: shippingAddress,
        shippingPhone: shippingPhone,
        note: note,
        details: details,
      }

      setLoading(true);
      const response = await authApi(token).post(endpoints["orders"], data);

      let timer;

      timer = setTimeout(() => {
        setLoading(false);
        setShowInfoModal(true);
      }, 1000);

      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    } catch (error) {
      setLoading(false);
      setError({ message: error.response.data.message, code: error.response.data.code });
      setShowErrorModal(true);
    }
  }
  
  return (
    <>
      {user && (
        <View style={styles.container}>
          <ScrollView
            style={{ flex: 1, padding: 16 }}
            contentContainerStyle={{ paddingBottom: 60 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.contentWrapper, { marginBottom: 16 }]}>
              <View style={styles.content}>
                <Text style={styles.title}>Họ tên</Text>
                <Text style={styles.value}>{user.lastname} {user.firstname}</Text>
              </View>

              <View style={styles.horizontalLine} />

              <View style={styles.content}>
                <Text style={styles.title}>Số điện thoại giao hàng</Text>
                <TextInput
                  style={styles.value}
                  value={shippingPhone}
                  onChangeText={(text) => setShippingPhone(text)}
                  placeholder="0123456789"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.horizontalLine} />

              <View style={styles.content}>
                <Text style={styles.title}>Địa chỉ giao hàng</Text>
                <TextInput
                  style={styles.value}
                  value={shippingAddress}
                  onChangeText={(text) => setShippingAddress(text)}
                  placeholder="Số 1, ..."
                />
              </View>

              <View style={styles.horizontalLine} />

              <View style={styles.content}>
                <Text style={styles.title}>Ghi chú</Text>
                <TextInput
                  style={styles.value}
                  value={note}
                  onChangeText={(text) => setNote(text)}
                  placeholder="Nhập ghi chú"
                />
              </View>
            </View>

            <View style={[styles.contentWrapper, { marginBottom: 16 }]}>
              <View style={styles.content}>
                <Text style={styles.title}>Tổng tiền (VNĐ)</Text>
                <Text style={styles.value}>{totalPrice.toLocaleString('vi-VN')}</Text>
              </View>
            </View>

            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
              />
            ))}

            <View style={{ marginBottom: 16 }} />

            <MyAuthButton text="Đặt hàng" onPress={handleCreate} />
          </ScrollView>
        </View>
      )}

      {error && showErrorModal && (
        <ErrorModal
          errorCode={error.code}
          msg={error.message}
          visible={showErrorModal}
          onPress={handleOk}
        />
      )}

      {loading && <LoadingModal visible={loading} />}

      {showInfoModal && (
        <InfoModal msg="Đặt hàng thành công." visible={showInfoModal} onPress={handleInfoOk} />
      )}

      {showInfo && (
        <InfoModal
          icon="alert-circle"
          visible={showInfo}
          msg="Bạn cần đăng nhập để tiếp tục."
          onPress={handleToLogin}
        />
      )}
    </>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  contentWrapper: {
    borderWidth: 1,
    borderColor: Color.darkerGray,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
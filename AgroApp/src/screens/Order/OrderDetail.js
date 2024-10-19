import { Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Color from "../../themes/Color";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState, useEffect } from "react";
import ErrorModal from "../../common/ErrorModal";
import LoadingModal from "../../common/LoadingModal";
import MyAuthButton from "../../components/MyAuthButton";
import { authApi, endpoints } from "../../services/api";
import { useSelector } from "react-redux";
import InfoModal from "../../common/InfoModal";
import PurchaseOrderStatusBadge from "../../components/PurchaseOrderStatusBadge";
import { fromNow } from "../../utils/dateUtils";
import { OrderStatus, OrderStatusString, PaymentMethodString } from "./OrderTab";

const OrderDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;
  const { user, token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [error, setError] = useState(null);

  const [detail, setDetail] = useState(null);

  const handleOk = () => {
    setShowErrorModal(false);
    setError(null);
  }

  const handleInfoOk = () => {
    setShowInfoModal(false);
  }

  const getDetail = async () => {
    try {
      setLoading(true);
      const response = await authApi(token).get(endpoints["orders-detail"](id));

      let timer;

      timer = setTimeout(() => {
        setLoading(false);
        setDetail(response.data.result);
      }, 1000);
    } catch (error) {
      setLoading(false);
      setError({ message: error.response.data.message, code: error.response.data.code });
      setShowErrorModal(true);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  };

  useEffect(() => {
    getDetail();
  }, [id]);

  const handlePress = async (action) => {
    if (detail) {
      let url;

      if (action === 'confirm') {
        url = endpoints["confirm-order"](id);
      }
      if (action === 'shipping') {
        url = endpoints["shipping-order"](id);
      }
      if (action === 'delivered') {
        url = endpoints["delivered-order"](id);
      }
      if (action === 'cancel') {
        url = endpoints["cancel-order"](id);
      }
      if (action === 'paid') {
        url = endpoints["paid-order"](id);
      }

      let timer;

      try {
        setLoading(true);
        const response = await authApi(token).post(url);

        timer = setTimeout(() => {
          setLoading(false);
          setShowInfoModal(true);
          setDetail(response.data.result);
        }, 1000);

        
      } catch (error) {
        console.log(error)
        timer = setTimeout(() => {
          setLoading(false);
          setError({ message: error.response.data.message, code: error.response.data.code });
          setShowErrorModal(true);
        }, 1000);
      }

      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    }
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          style={{ flex: 1, padding: 16 }}
          contentContainerStyle={{ paddingBottom: detail?.status === 'PENDING' ? 200 : 130  }}
          keyboardShouldPersistTaps="handled"
        >
          {detail && (
            <>
              <View style={[styles.contentWrapper, { marginBottom: 16 }]}>
                {/* Thông tin đơn hàng */}
                <View style={styles.content}>
                  <Text style={styles.title}>Mã đơn hàng</Text>
                  <Text style={styles.value}>{detail.id}</Text>
                </View>

                <View style={styles.horizontalLine} />

                <View style={styles.content}>
                  <Text style={styles.title}>Họ tên khách hàng</Text>
                  <Text style={styles.value}>{detail.customer.lastname} {detail.customer.firstname}</Text>
                </View>

                <View style={styles.horizontalLine} />

                <View style={styles.content}>
                  <Text style={styles.title}>Địa chỉ giao hàng</Text>
                  <Text style={styles.value}>{detail.shippingAddress}</Text>
                </View>

                <View style={styles.horizontalLine} />

                <View style={styles.content}>
                  <Text style={styles.title}>Số điện thoại giao hàng</Text>
                  <Text style={styles.value}>{detail.shippingPhone}</Text>
                </View>

                <View style={styles.horizontalLine} />

                <View style={styles.content}>
                  <Text style={styles.title}>Ghi chú</Text>
                  <Text style={styles.value}>{detail.note}</Text>
                </View>
              </View>

              {/* Thông tin khách hàng */}
              <View style={[styles.contentWrapper, { marginBottom: 16 }]}>
                <View style={styles.content}>
                  <Text style={styles.title}>Tổng giá trị đơn hàng (VNĐ)</Text>
                  <Text style={styles.value}>{detail.totalAmount.toLocaleString("vi-VN")}</Text>
                </View>

                <View style={styles.horizontalLine} />

                <View style={styles.content}>
                  <Text style={styles.title}>Giảm giá (VNĐ)</Text>
                  <Text style={styles.value}>{detail.discountAmount.toLocaleString("vi-VN")}</Text>
                </View>

                <View style={styles.horizontalLine} />

                <View style={styles.content}>
                  <Text style={styles.title}>Tổng tiền (VNĐ)</Text>
                  <Text style={styles.value}>{detail.netAmount.toLocaleString("vi-VN")}</Text>
                </View>
              </View>

              {/* Thông tin thanh toán, trạng thái */}
              <View style={[styles.contentWrapper, { marginBottom: 16 }]}>
                <View style={styles.content}>
                  <Text style={styles.title}>Phương thức thanh toán</Text>
                  <Text style={styles.value}>{PaymentMethodString(detail.paymentMethod)}</Text>
                </View>

                <View style={styles.horizontalLine} />

                <View style={styles.content}>
                  <Text style={styles.title}>Trạng thái đơn hàng</Text>
                  <Text style={styles.value}>{OrderStatusString(detail.status)}</Text>
                </View>
              </View>

              {detail.details && detail.details.map((item) => {
                return (
                  <View style={[styles.contentWrapper, { marginBottom: 16 }]} key={item.id}>
                    <View style={styles.content}>
                      <Text style={styles.title}>Tên mặt hàng</Text>
                      <Text style={styles.value}>{item.price.itemName}</Text>
                    </View>

                    <View style={styles.horizontalLine} />

                    <View style={styles.content}>
                      <Text style={styles.title}>Số lượng (kg)</Text>
                      <Text style={styles.value}>{item.quantity}</Text>
                    </View>

                    <View style={styles.horizontalLine} />

                    <View style={styles.content}>
                      <Text style={styles.title}>Đơn giá (VNĐ)</Text>
                      <Text style={styles.value}>{item.unitPrice.toLocaleString("vi-VN")}</Text>
                    </View>

                    <View style={styles.horizontalLine} />

                    <View style={styles.content}>
                      <Text style={styles.title}>Tổng tiền (VNĐ)</Text>
                      <Text style={styles.value}>{item.totalPrice.toLocaleString("vi-VN")}</Text>
                    </View>
                  </View>
                );
              })}

              <View style={[styles.contentWrapper, { marginTop: 16, marginBottom: 20, }]}>
                <View style={styles.content}>
                  <Text style={styles.title}>Tạo lúc</Text>
                  <Text style={styles.value}>{fromNow(detail.createdAt)}</Text>
                </View>

                <View style={styles.horizontalLine} />

                <View style={styles.content}>
                  <Text style={styles.title}>Cập nhật lúc</Text>
                  <Text style={styles.value}>{fromNow(detail.updatedAt)}</Text>
                </View>
              </View>
            </>
          )}
        </ScrollView>

        {user.account.role !== "CUSTOMER" && detail && detail.status !== OrderStatus.PAID && (
          <View style={styles.bottomWrapper}>
            <MyAuthButton
              text={TextBtn(detail.status)}
              onPress={() => handlePress(action(detail.status))}
            />
            {detail.status === OrderStatus.PENDING && (
              <MyAuthButton
                text="Huỷ đơn hàng"
                onPress={() => handlePress(action(detail.status, true))}
              />
            )}
          </View>
        )}

        {user.account.role === "CUSTOMER" && detail && detail.status === OrderStatus.PENDING && (
          <View style={styles.bottomWrapper}>
            <MyAuthButton
              text="Huỷ đơn hàng"
              onPress={() => handlePress(action(detail.status, true))}
            />
          </View>
        )}

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

      {showInfoModal && (
        <InfoModal msg="Thành công." visible={showInfoModal} onPress={handleInfoOk} />
      )}
    </>
  );
};

export default OrderDetail;

export const TextBtn = (status) => {
  switch (status) {
    case OrderStatus.PENDING:
      return 'Xác nhận đơn hàng';
    case OrderStatus.CONFIRMED:
      return 'Giao hàng';
    case OrderStatus.SHIPPING:
      return 'Đã giao hàng';
    case OrderStatus.DELIVERED:
      return 'Đã thanh toán';
  }
}

const action = (status, isCancel) => {
  if (isCancel) {
    return 'cancel';
  }
  switch (status) {
    case OrderStatus.PENDING:
      return 'confirm';
    case OrderStatus.CONFIRMED:
      return 'shipping';
    case OrderStatus.SHIPPING:
      return 'delivered';
    case OrderStatus.DELIVERED:
      return 'paid';
  }
}

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

  bottomWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Color.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Color.darkerGray,
    paddingBottom: 30,
  },
});
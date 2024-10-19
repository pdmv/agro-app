import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
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

const PurchaseOrderDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;
  const { token } = useSelector((state) => state.auth);
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

  let timer;

  const getDetail = async () => {
    try {
      setLoading(true);
      const response = await authApi(token).get(endpoints["purchase-order-detail"](id));


      timer = setTimeout(() => {
        setLoading(false);
        setDetail(response.data.result);
      }, 1000);
    } catch (error) {
      timer = setTimeout(() => {
        setLoading(false);
        setError({ message: error.response.data.message, code: error.response.data.code });
        setShowErrorModal(true);
      }, 1000)
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

  const handleEnterPrice = async () => {
    if (detail) {
      let timer;

      try {
        setLoading(true);
        const response = await authApi(token).post(endpoints["purchase-order-enter-price"](detail.id), detail);

        timer = setTimeout(() => {
          setLoading(false);
          setShowErrorModal(true);
          getDetail();
        }, 1000);

      } catch (error) {
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
  }

  const handleImport = async () => {
    if (detail) {
      let timer;

      try {
        setLoading(true);
        const response = await authApi(token).post(endpoints["import-inventory"], {
          purchaseOrderId: detail.id,
        });


        timer = setTimeout(() => {
          setLoading(false);
          setShowErrorModal(true);
          getDetail();
        }, 1000);

      } catch (error) {
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
  }

  const unitPriceOnChange = (itemId, unitPrice) => {
    const updatedDetails = detail.details.map((item) => {
      if (item.id === itemId) {
        const totalPrice = item.quantity * unitPrice;
        return { ...item, unitPrice, totalPrice };
      }
      return item;
    });

    const newTotalAmount = updatedDetails.reduce((acc, item) => acc + item.totalPrice, 0);

    setDetail((prevDetail) => ({
      ...prevDetail,
      details: updatedDetails,
      totalAmount: newTotalAmount,
    }));
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <ScrollView
            style={{ flex: 1, padding: 16 }}
            contentContainerStyle={{ paddingBottom: 130 }}
            keyboardShouldPersistTaps="handled"
          >
            {detail && (
              <>
                <View style={[styles.contentWrapper, { marginBottom: 16 }]}>
                  <View style={styles.content}>
                    <Text style={styles.title}>Tên nhà cung cấp</Text>
                    <Text style={styles.value}>{detail.supplier.name}</Text>
                  </View>

                  <View style={styles.horizontalLine} />

                  <View style={styles.content}>
                    <Text style={styles.title}>Số điện thoại</Text>
                    <Text style={styles.value}>{detail.supplier.phoneNumber}</Text>
                  </View>

                  <View style={styles.horizontalLine} />

                  <View style={styles.content}>
                    <Text style={styles.title}>Địa chỉ</Text>
                    <Text style={styles.value}>{detail.supplier.address}</Text>
                  </View>
                </View>

                <View style={[styles.contentWrapper, { marginBottom: 16 }]}>
                  <View style={styles.content}>
                    <Text style={styles.title}>Tổng tiền (VNĐ)</Text>
                    <Text style={styles.value}>{detail.totalAmount.toLocaleString("vi-VN")}</Text>
                  </View>

                  <View style={styles.horizontalLine} />

                  <View style={styles.content}>
                    <Text style={styles.title}>Trạng thái</Text>
                    <PurchaseOrderStatusBadge status={detail.status} />
                  </View>
                </View>

                {detail.details && detail.details.map((item) => {
                  return (
                    <View style={[styles.contentWrapper, { marginBottom: 16 }]} key={item.id}>
                      <View style={styles.content}>
                        <Text style={styles.title}>Tên mặt hàng</Text>
                        <Text style={styles.value}>{item.product.name}</Text>
                      </View>

                      <View style={styles.horizontalLine} />

                      <View style={styles.content}>
                        <Text style={styles.title}>Số lượng (kg)</Text>
                        <Text style={styles.value}>{item.quantity}</Text>
                      </View>

                      <View style={styles.horizontalLine} />

                      <View style={styles.content}>
                        <Text style={styles.title}>Giá đề nghị (VNĐ)</Text>
                        <Text style={styles.value}>{item.expectedPrice.toLocaleString("vi-VN")}</Text>
                      </View>

                      <View style={styles.horizontalLine} />

                      <View style={styles.content}>
                        <Text style={styles.title}>Giá thanh toán (VNĐ)</Text>
                        <TextInput
                          style={styles.value}
                          value={item.unitPrice.toString()}
                          keyboardType="numeric"
                          onChangeText={(value) => {
                            if (value === '') {
                              value = 0;
                            }
                            unitPriceOnChange(item.id, parseFloat(value));
                          }}
                          editable={detail.status === 'IMPORTED' || detail.status === 'PRICE_ENTERED'}
                        />
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

          {detail && detail.status === 'PENDING' && (
            <View style={styles.bottomWrapper}>
              <MyAuthButton
                text="Nhập hàng"
                onPress={handleImport}
              />
            </View>
          )}

          {detail && (detail.status === 'IMPORTED' || detail.status === 'PRICE_ENTERED') && (
            <View style={styles.bottomWrapper}>
              <MyAuthButton
                text="Nhập giá"
              onPress={handleEnterPrice}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>

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

export default PurchaseOrderDetail;

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
    textAlign: 'right',
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
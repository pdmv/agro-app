import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Color from "../../themes/Color";
import { useNavigation, useRoute } from "@react-navigation/native";
import LoadingModal from "../../common/LoadingModal";
import ErrorModal from "../../common/ErrorModal";
import InfoModal from "../../common/InfoModal";
import { authApi, endpoints } from "../../services/api";
import { useSelector } from "react-redux";
import { fromNow } from "../../utils/dateUtils";

const PaymentDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [detail, setDetail] = useState(null);

  const fetchDetail = async () => {
    let timer;
    try {
      setLoading(true);
      const response = await authApi(token).get(endpoints["payments-detail"](id));

      timer = setTimeout(() => {
        setDetail(response.data.result);
        setLoading(false);
      }, []);
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
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handlePaid = async () => {
    let timer;
    try {
      setLoading(true);
      const response = await authApi(token).get(endpoints["pay-payment"](id));

      timer = setTimeout(() => {
        setDetail(response.data.result);
        setShowInfoModal(true);
        setLoading(false);
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
  };

  const renderPaymentMethod = (method) => {
    switch (method) {
      case "CASH":
        return "Tiền mặt";
      case "E_WALLET":
        return "Ví điện tử";
      case "BANK_TRANSFER":
        return "Chuyển khoản";
      default:
        return "Không xác định";
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <View style={[styles.badge, { backgroundColor: Color.warning }]}><Text style={styles.badgeText}>Chờ thanh toán</Text></View>;
      case "PAID":
        return <View style={[styles.badge, { backgroundColor: Color.normal }]}><Text style={styles.badgeText}>Đã thanh toán</Text></View>;
      case "CANCELLED":
        return <View style={[styles.badge, { backgroundColor: Color.error }]}><Text style={styles.badgeText}>Đã hủy</Text></View>;
      default:
        return null;
    }
  };

  return (
    <>
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
                  <Text style={styles.title}>Mã hoá đơn</Text>
                  <Text style={styles.value}>{detail.id}</Text>
                </View>

                <View style={styles.horizontalLine} />

                <View style={styles.content}>
                  <Text style={styles.title}>Nhà cung cấp</Text>
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
                  <Text style={styles.title}>Tên nhân viên</Text>
                  <Text style={styles.value}>{`${detail.staff.lastname} ${detail.staff.firstname}`}</Text>
                </View>

                <View style={styles.horizontalLine} />

                <View style={styles.content}>
                  <Text style={styles.title}>Số điện thoại</Text>
                  <Text style={styles.value}>{detail.staff.phoneNumber}</Text>
                </View>

                <View style={styles.horizontalLine} />

                <View style={styles.content}>
                  <Text style={styles.title}>Email</Text>
                  <Text style={styles.value}>{detail.staff.email}</Text>
                </View>
              </View>

              <View style={[styles.contentWrapper, { marginBottom: 16 }]}>
                <View style={styles.content}>
                  <Text style={styles.title}>Tổng tiền thanh toán (VNĐ)</Text>
                  <Text style={styles.value}>{detail.totalAmount.toLocaleString("vi-VN")}</Text>
                </View>

                <View style={styles.horizontalLine} />

                <View style={styles.content}>
                  <Text style={styles.title}>Phương thức thanh toán</Text>
                  <Text style={styles.value}>{renderPaymentMethod(detail.paymentMethod)}</Text>
                </View>

                <View style={styles.horizontalLine} />

                <View style={styles.content}>
                  <Text style={styles.title}>Trạng thái</Text>
                  {renderStatusBadge(detail.status)}
                </View>

                <View style={styles.horizontalLine} />

                <View style={styles.content}>
                  <Text style={styles.title}>Ghi chú</Text>
                  <Text style={styles.value}>{detail.note}</Text>
                </View>
              </View>

              {detail.details && detail.details.map((purchase) => {
                return(
                  <View key={purchase.id} style={[styles.contentWrapper, { marginBottom: 16 }]}>
                    <View style={styles.content}>
                      <Text style={styles.title}>Mã đơn nhập hàng</Text>
                      <Text style={styles.value}>{purchase.purchaseOrder.id}</Text>
                    </View>

                    <View style={styles.horizontalLine} />

                    <View style={styles.content}>
                      <Text style={styles.title}>Tổng tiền</Text>
                      <Text style={styles.value}>{purchase.purchaseOrder.totalAmount.toLocaleString("vi-VN")}</Text>
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

        {detail && detail.status === "PENDING" && (
          <View style={styles.bottomWrapper}>
            <MyAuthButton
              text="Đã thanh toán"
              onPress={handlePaid}
            />
          </View>
        )}
      </View>

      {loading && <LoadingModal visible={loading} />}
      {showErrorModal && <ErrorModal msg={error} visible={showErrorModal} onPress={() => setShowErrorModal(false)} />}
      {showInfoModal && <InfoModal msg="Thanh toán thành công." visible={showInfoModal} onPress={() => setShowInfoModal(false)} />}
    </>
  );
};

export default PaymentDetail;

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

  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  badgeText: {
    color: Color.white,
    paddingVertical: 4,
    paddingHorizontal: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
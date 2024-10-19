import { Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Color from "../../themes/Color";
import { useNavigation } from "@react-navigation/native";
import { useState, useContext } from "react";
import ErrorModal from "../../common/ErrorModal";
import LoadingModal from "../../common/LoadingModal";
import MyAuthButton from "../../components/MyAuthButton";
import { authApi, endpoints } from "../../services/api";
import { useSelector } from "react-redux";
import InfoModal from "../../common/InfoModal";
import FunctionNav from "../../components/FunctionNav";
import { SupplierContext } from "../../contexts/SupplierContext";
import PurchaseProduct from "../../components/PurchaseProduct";
import { PurchaseProductContext } from "../../contexts/PurchaseProductContext";
import { PurchaseOrderContext } from "../../contexts/PurchaseOrderContext";
import PurchaseOrderContainer from "../../components/PurchaseOrderContainer";

const PaymentCreate = () => {
  const navigation = useNavigation();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [error, setError] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("Tiền mặt");
  const [note, setNote] = useState("");

  const { selectedSupplier, setSelectedSupplier } = useContext(SupplierContext);
  const { selectedPurchases, setSelectedPurchases } = useContext(PurchaseOrderContext);

  const handleOk = () => {
    setShowErrorModal(false);
    setError(null);
  }

  const handleInfoOk = () => {
    setShowInfoModal(false);
    navigation.goBack();
  }

  const handleCreate = async () => {
    if (!selectedSupplier || selectedPurchases.length === 0) {
      setError({ message: "Vui lòng chọn nhà cung cấp và ít nhất đơn nhập hàng.", code: 400 });
      setShowErrorModal(true);
      return;
    }

    const payload = {
      supplierId: selectedSupplier.id,
      paymentMethod: "CASH",
      status: "PENDING",
      note: note,
      purchaseOrderIds: [
        ...selectedPurchases.map(purchase => purchase.id)
      ],
    };

    try {
      setLoading(true);
      const response = await authApi(token).post(endpoints["payments"], payload);

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
  };

  const handleSelectSupplier = () => {
    setSelectedPurchases([]);
    setSelectedSupplier(null);
    navigation.navigate("SelectSupplier");
  }

  const handleSelectPurchase = () => {
    navigation.navigate("SelectPurchaseOrder", {
      supplierId: selectedSupplier.id
    });
  }

  const handleDelete = (id) => {
    setSelectedPurchases(prevProducts => prevProducts.filter(purchase => purchase.id !== id));
  }

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          style={{ flex: 1, padding: 16 }}
          contentContainerStyle={{ paddingBottom: 60 }}
          keyboardShouldPersistTaps="handled"
        >
          <FunctionNav title="Chọn nhà cung cấp" rightIcon="chevron-right" onPress={() => handleSelectSupplier()} />

          {selectedSupplier && (
            <>
              <View style={[styles.contentWrapper, { marginBottom: 16 }]}>
                <View style={styles.content}>
                  <Text style={styles.title}>Tên nhà cung cấp</Text>
                  <Text style={styles.value}>{selectedSupplier.name}</Text>
                </View>

                <View style={styles.horizontalLine} />

                <View style={styles.content}>
                  <Text style={styles.title}>Số điện thoại</Text>
                  <Text style={styles.value}>{selectedSupplier.phoneNumber}</Text>
                </View>

                <View style={styles.horizontalLine} />

                <View style={styles.content}>
                  <Text style={styles.title}>Địa chỉ</Text>
                  <Text style={styles.value}>{selectedSupplier.address}</Text>
                </View>
              </View>

              <View style={[styles.contentWrapper, { marginBottom: 16 }]}>
                <View style={styles.content}>
                  <Text style={styles.title}>Phương thức thanh toán</Text>
                  <Text style={styles.value}>{paymentMethod}</Text>
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

              {selectedPurchases && selectedPurchases.map((purchase) => {
                return (
                  <PurchaseOrderContainer
                    key={purchase.id}
                    purchase={purchase}
                    handleDelete={handleDelete}
                  />
                );
              })}

              <FunctionNav title="Chọn đơn nhập hàng" rightIcon="chevron-right" onPress={() => handleSelectPurchase()} />
            </>
          )}

          <MyAuthButton
            text="Tạo hoá đơn"
            onPress={handleCreate}
          />
        </ScrollView>
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
        <InfoModal msg="Tạo hoá đơn thành công." visible={showInfoModal} onPress={handleInfoOk} />
      )}
    </>
  );
};

export default PaymentCreate;

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
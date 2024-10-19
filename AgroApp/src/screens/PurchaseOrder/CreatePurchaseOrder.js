import { Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Color from "../../themes/Color";
import { useNavigation } from "@react-navigation/native";
import { useState, useContext} from "react";
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

const CreatePurchaseOrder = () => {
  const navigation = useNavigation();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [error, setError] = useState(null);

  const { selectedSupplier, setSelectedSupplier } = useContext(SupplierContext);
  const { selectedProducts, setSelectedProducts } = useContext(PurchaseProductContext);

  const handleOk = () => {
    setShowErrorModal(false);
    setError(null);
  }

  const handleInfoOk = () => {
    setShowInfoModal(false);
    setSelectedProducts([]);
    setSelectedSupplier(null);
    navigation.goBack();
  }

  const handleCreate = async () => {
    if (!selectedSupplier || selectedProducts.length === 0) {
      setError({ message: "Vui lòng chọn nhà cung cấp và ít nhất một sản phẩm.", code: 400 });
      setShowErrorModal(true);
      return;
    }

    const payload = {
      supplierId: selectedSupplier.id,
      details: selectedProducts.map(product => ({
        productId: product.productId,
        quantity: product.quantity,
        expectedPrice: product.expectedPrice,
      })),
    };

    try {
      setLoading(true);
      const response = await authApi(token).post(endpoints["purchase-order"], payload);

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
    navigation.navigate("SelectSupplier");
  }

  const handleSelectProduct = () => {
    navigation.navigate("SelectProduct");
  }

  const handleChange = (id, field, value) => {
    setSelectedProducts(prevSelectedProducts => {
      return prevSelectedProducts.map(product =>
        product.productId === id
          ? { ...product, [field]: value }
          : product
      );
    });
  };

  const handleDelete = (productId) => {
    setSelectedProducts(prevProducts => prevProducts.filter(product => product.productId !== productId));
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

              {selectedProducts && selectedProducts.map((product) => {
                return (
                  <PurchaseProduct
                    key={product.productId}
                    product={product}
                    onChange={handleChange}
                    handleDelete={handleDelete}
                  />
                );
              })}

              <FunctionNav title="Chọn mặt hàng" rightIcon="chevron-right" onPress={() => handleSelectProduct()} />
            </>
          )}

          <MyAuthButton text="Tạo đơn nhập hàng" onPress={handleCreate} />
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
        <InfoModal msg="Tạo đơn nhập hàng thành công." visible={showInfoModal} onPress={handleInfoOk} />
      )}
    </>
  );
};

export default CreatePurchaseOrder;

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
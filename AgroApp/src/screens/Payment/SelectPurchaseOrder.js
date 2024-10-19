import { Keyboard, ScrollView, StyleSheet, View, RefreshControl } from "react-native";
import ErrorModal from "../../common/ErrorModal";
import { useState, useEffect, useContext } from "react";
import { authApi, endpoints } from "../../services/api";
import { useSelector } from "react-redux";
import FunctionNav from "../../components/FunctionNav";
import Color from "../../themes/Color";
import { useNavigation, useRoute } from "@react-navigation/native";
import { PurchaseOrderContext } from "../../contexts/PurchaseOrderContext";

const SelectPurchaseOrder = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { token } = useSelector((state) => state.auth);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [list, setList] = useState([]);

  const { supplierId } = route.params;
  const { selectedPurchases, setSelectedPurchases } = useContext(PurchaseOrderContext);

  const handleOk = () => {
    setShowErrorModal(false);
    setError(null);
  };

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    try {
      const response = await authApi(token)
        .get(`${endpoints["purchase-order"]}?supplierId=${supplierId}&status=PRICE_ENTERED`);

      setList(response.data.result);
    } catch (error) {
      setError({ message: error.response.data.message, code: error.response.data.code });
      setShowErrorModal(true);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    getList();
  };

  const handleDetail = ({ item }) => {
    setSelectedPurchases((prevSelected) => {
      const isAlreadySelected = prevSelected.some(purchase => purchase.id === item.id);

      if (!isAlreadySelected) {
        return [...prevSelected, item];
      } else {
        return prevSelected;
      }
    });
    navigation.goBack();
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          style={{ marginTop: 20, paddingHorizontal: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {list && list.map((item) => {
            return (
              <FunctionNav
                key={item.id}
                title={`#${item.id} ${item.supplier.name}`}
                leftIcon="clipboard"
                rightIcon="chevron-right"
                onPress={() => handleDetail({ item })}
              />
            );
          })}
        </ScrollView>
      </View>

      {/* Error Modal */}
      {error && showErrorModal && (
        <ErrorModal
          errorCode={error.code}
          msg={error.message}
          visible={showErrorModal}
          onPress={handleOk}
        />
      )}
    </>
  );
};

export default SelectPurchaseOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
});
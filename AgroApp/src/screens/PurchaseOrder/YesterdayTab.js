import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import Color from "../../themes/Color";
import FunctionNav from "../../components/FunctionNav";
import { useSelector } from "react-redux";
import ErrorModal from "../../common/ErrorModal";
import LoadingModal from "../../common/LoadingModal";
import { useState, useEffect, useCallback } from "react";
import { authApi, endpoints } from "../../services/api";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";

const YesterdayTab = () => {
  const navigation = useNavigation();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [list, setList] = useState([]);

  useEffect(() => {
    getList();
  }, []);

  const handleOk = () => {
    setShowErrorModal(false);
    setError(null);
  }

  const getList = async () => {
    let timer;

    try {
      setLoading(true);

      const startDate = moment().subtract(1, 'days').startOf('day').format("YYYY-MM-DDTHH:mm:ss");
      const endDate = moment().startOf('day').format("YYYY-MM-DDTHH:mm:ss");

      const response = await authApi(token).get(`${endpoints["purchase-order"]}?startDate=${startDate}&endDate=${endDate}`);
      setList(response.data.result);

      timer = setTimeout(() => {
        setLoading(false);
        setRefreshing(false);
      }, 1000);

    } catch (error) {
      setLoading(false)
      setRefreshing(false);
      setError({ message: error.response.data.message, code: error.response.data.code });
      setShowErrorModal(true);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getList();
  }, []);

  const handleDetail = (id) => {
    navigation.navigate("PurchaseOrderDetail", { id: id })
  }

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{ flex: 1, padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {list && list.map((item) => {
            return (
              <FunctionNav
                key={item.id}
                title={item.supplier.name}
                leftIcon="file-text"
                rightIcon="chevron-right"
                purchaseCreatedAt={item.createdAt}
                onPress={() => handleDetail(item.id)}
              />
            );
          })}
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
    </>
  );
};

export default YesterdayTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  }
});
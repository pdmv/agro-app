import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import Color from "../../themes/Color";
import FunctionNav from "../../components/FunctionNav";
import { useEffect, useState, useCallback } from 'react';
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { authApi, endpoints } from "../../services/api";
import ErrorModal from "../../common/ErrorModal";
import LoadingModal from "../../common/LoadingModal";

const PaymentList = ({ status }) => {
  const navigation = useNavigation();
  const { token } = useSelector((state) => state.auth);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false); // Thêm state loading
  const [list, setList] = useState([]);

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    let timer;
    try {
      const response = await authApi(token).get(`${endpoints["payments"]}?status=${status}`);
      timer = setTimeout(() => {
        setList(response.data.result);
        setLoading(false);
        setRefreshing(false);
      }, 1000);
    } catch (error) {
      timer = setTimeout(() => {
        setLoading(false);
        setRefreshing(false);
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getList();
  }, []);

  const handleDetail = ({ item }) => {
    navigation.navigate("PaymentDetail", {
      id: item.id
    });
  };

  const handleOk = () => {
    setShowErrorModal(false);
    setError(null);
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{ flex: 1, padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {list && list.map((item) => (
            <FunctionNav
              key={item.id}
              title={`#${item.id} ${item.supplier.name}`}
              leftIcon="clipboard"
              rightIcon="chevron-right"
              onPress={() => handleDetail({ item })}
            />
          ))}
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

export default PaymentList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
});
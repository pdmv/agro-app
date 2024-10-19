import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import Color from "../../themes/Color";
import FunctionNav from "../../components/FunctionNav";
import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from "react-redux";
import { getProductListThunk, resetError, resetStatus } from "../../redux/productSlice";
import LoadingModal from "../../common/LoadingModal";
import { useNavigation } from "@react-navigation/native";
import API, { endpoints } from "../../services/api"
import ErrorModal from "../../common/ErrorModal";

const PriceList = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [list, setList] = useState([]);


  useEffect(() => {
    getList();
  }, []);

  
  const getList = async () => {
    try {
      const response = await API().get(endpoints["list-price"]);
      setList(response.data.result);
    } catch (error) {
      console.log(error);
      setError({ message: error.response.data.message, code: error.response.data.code });
      setShowErrorModal(true);
    } finally {
      setRefreshing(false);
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getList();
  }, []);

  const handleDetail = ({ item }) => {
    navigation.navigate("PriceDetail", {
      productId: item.product.id
    });
  }

  const handleOk = () => {
    setShowErrorModal(false);
    setError(null);
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
              title={item.itemName}
              leftIcon="dollar-sign"
              rightIcon="chevron-right"
              onPress={() => handleDetail({ item })} />
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
    </>
  );
};

export default PriceList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  }
});
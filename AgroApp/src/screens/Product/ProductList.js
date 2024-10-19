import { ScrollView, StyleSheet, Text, View } from "react-native";
import Color from "../../themes/Color";
import FunctionNav from "../../components/FunctionNav";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getProductListThunk, resetError, resetStatus } from "../../redux/productSlice";
import LoadingModal from "../../common/LoadingModal";
import { useNavigation } from "@react-navigation/native";


const ProductList = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { error, status, list } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProductListThunk());
  }, [])

  useEffect(() => {
    let timeoutId;

    if (status === 'loading') {
      setLoading(true);
    } else if (status === 'succeeded') {
      timeoutId = setTimeout(() => {
        setLoading(false);
      }, 1000);
    } else if (status === 'failed') {
      timeoutId = setTimeout(() => {
        setLoading(false);
        setShowErrorModal(true);
      }, 1000);
    } else {
      setLoading(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [status]);

  const handleOk = () => {
    setShowErrorModal(false);
    dispatch(resetError());
    dispatch(resetStatus());
  }
  
  const handleDetail = ({ item }) => {
    navigation.navigate("ProductDetail", { item });
  }

  return (
    <>
      <ScrollView style={styles.container}>
        {list && list.map((item) => {
          return (
            <FunctionNav key={item.id} title={item.name} leftIcon="package" rightIcon="chevron-right" onPress={() => handleDetail({ item })} />
          );
        })}
      </ScrollView>

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

export default ProductList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
    padding: 16,
  }
});
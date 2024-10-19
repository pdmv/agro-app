import { ScrollView, StyleSheet, Text, View } from "react-native";
import Color from "../../themes/Color";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from 'react';
import { getSupplierListThunk, resetError, resetStatus } from "../../redux/supplierSlice";
import LoadingModal from "../../common/LoadingModal";
import ErrorModal from "../../common/ErrorModal";
import FunctionNav from "../../components/FunctionNav";
import { useNavigation } from "@react-navigation/native";

const SupplierList = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { error, status, list } = useSelector((state) => state.suppliers);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getSupplierListThunk(token));
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
    navigation.navigate("SupplierDetail", { item });
  }

  return (
    <>
      <ScrollView style={styles.container}>
        {list && list.map((item) => {
          return (
            <FunctionNav key={item.id} title={item.name} leftIcon="truck" rightIcon="chevron-right" onPress={() => handleDetail({item})}  />
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

export default SupplierList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
    padding: 16,
  }
});
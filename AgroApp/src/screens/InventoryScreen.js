import { ScrollView, StyleSheet, Text, View, RefreshControl } from "react-native";
import Color from "../themes/Color";
import InventoryItem from "../components/InventoryItem";
import ErrorModal from "../common/ErrorModal";
import LoadingModal from "../common/LoadingModal";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInventoryThunk, resetError, resetStatus } from "../redux/inventorySlice";
import InfoModal from "../common/InfoModal";
import { useNavigation } from "@react-navigation/native";

const InventoryScreen = () => {
  const navigation = useNavigation();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const { error, status, inventory } = useSelector((state) => state.inventory);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) {
      setShowInfo(true);
    }
  }, [isAuthenticated]);

  const handleToLogin = () => {
    setShowInfo(false);
    navigation.navigate("Login");
  };

  if (!isAuthenticated) {
    return (
      <InfoModal
        icon="alert-circle"
        visible={showInfo}
        msg="Bạn cần đăng nhập để tiếp tục."
        onPress={handleToLogin}
      />
    );
  }

  useEffect(() => {
    dispatch(getInventoryThunk(token));
  }, []);

  useEffect(() => {
    let timeoutId;

    if (status === 'loading') {
      setLoading(true);
    } else if (status === 'succeeded') {
      timeoutId = setTimeout(() => {
        setLoading(false);
        setRefreshing(false);
      }, 1000);
    } else if (status === 'failed') {
      timeoutId = setTimeout(() => {
        setLoading(false);
        setRefreshing(false);
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

  // Hàm làm mới khi kéo xuống
  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getInventoryThunk(token));
  };

  const handleOk = () => {
    setShowErrorModal(false);
    dispatch(resetError());
    dispatch(resetStatus());
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {inventory && inventory.map((item) => {
          return (
            <InventoryItem key={item.id} productName={item.product.name} quantity={item.quantity} />
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

export default InventoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
    padding: 15,
  },
});
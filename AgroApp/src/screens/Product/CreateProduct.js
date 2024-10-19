import { Keyboard, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import Color from "../../themes/Color";
import { useNavigation, useRoute } from "@react-navigation/native";
import { formatDateTime, fromNow } from "../../utils/dateUtils";
import { useState } from "react";
import ErrorModal from "../../common/ErrorModal";
import LoadingModal from "../../common/LoadingModal";
import MyAuthButton from "../../components/MyAuthButton";
import { authApi, endpoints } from "../../services/api";
import { useSelector } from "react-redux";
import InfoModal from "../../common/InfoModal";

const CreateProduct = () => {
  const navigation = useNavigation();
  const { token } = useSelector((state) => state.auth);
  const [product, setProduct] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [error, setError] = useState(null);

  const onChangeText = (field, value) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      [field]: value,
    }));
  };

  const handleOk = () => {
    setShowErrorModal(false);
    setError(null);
  }

  const handleInfoOk = () => {
    setShowInfoModal(false);
    navigation.goBack();
  }

  const handleCreate = async () => {
    try {
      setLoading(true);
      const response = await authApi(token).post(endpoints["product"], product);

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
  }

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={styles.container}>
          <View style={[styles.contentWrapper, { marginBottom: 20 }]}>
            <View style={styles.content}>
              <Text style={styles.title}>Tên mặt hàng</Text>
              <TextInput
                style={styles.value}
                value={product.name}
                placeholder="Khổ qua"
                onChangeText={(text) => onChangeText("name", text)}
              />
            </View>

            <View style={styles.horizontalLine} />

            <View style={styles.content}>
              <Text style={styles.title}>Mô tả</Text>
              <TextInput
                style={styles.value}
                value={product.description}
                placeholder="Đắng, ..."
                onChangeText={(text) => onChangeText("description", text)}
              />
            </View>
          </View>
          <MyAuthButton text="Tạo mặt hàng" onPress={handleCreate} />
        </View>
      </TouchableWithoutFeedback>

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
        <InfoModal msg="Tạo mặt hàng thành công." visible={showInfoModal} onPress={handleInfoOk} />
      )}
    </>
  );
};

export default CreateProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
    padding: 16,
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
    textAlign: 'right',
  },
  horizontalLine: {
    borderBottomColor: Color.darkerGray,
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});
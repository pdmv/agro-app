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

const SupplierDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { token } = useSelector((state) => state.auth);
  const { item } = route.params;
  const [supplier, setSupplier] = useState(item);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [error, setError] = useState(null);

  const onChangeText = (field, value) => {
    setSupplier((prev) => ({
      ...prev,
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

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const response = await authApi(token).post(endpoints["change-supplier"](supplier.id), supplier);

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
          <View style={styles.contentWrapper}>
            <View style={styles.content}>
              <Text style={styles.title}>Tên nhà cung cấp</Text>
              <TextInput
                style={styles.value}
                value={supplier.name}
                placeholder="Nguyễn Văn A"
                onChangeText={(text) => onChangeText("name", text)}
              />
            </View>

            <View style={styles.horizontalLine} />

            <View style={styles.content}>
              <Text style={styles.title}>Số điện thoại</Text>
              <TextInput
                style={styles.value}
                value={supplier.phoneNumber}
                placeholder="0999999999"
                keyboardType="phone-pad"
                onChangeText={(text) => onChangeText("phoneNumber", text)}
              />
            </View>

            <View style={styles.horizontalLine} />

            <View style={styles.content}>
              <Text style={styles.title}>Địa chỉ</Text>
              <TextInput
                style={styles.value}
                value={supplier.address}
                placeholder="Số 1, ..."
                onChangeText={(text) => onChangeText("address", text)}
              />
            </View>
          </View>

          <View style={[styles.contentWrapper, { marginTop: 16, marginBottom: 20, }]}>
            <View style={styles.content}>
              <Text style={styles.title}>Tạo lúc</Text>
              <Text style={styles.value}>{fromNow(supplier.createdAt)}</Text>
            </View>

            <View style={styles.horizontalLine} />

            <View style={styles.content}>
              <Text style={styles.title}>Cập nhật lúc</Text>
              <Text style={styles.value}>{fromNow(supplier.updatedAt)}</Text>
            </View>
          </View>

          <MyAuthButton text="Cập nhật" onPress={handleUpdate} leftIcon="edit" />
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
        <InfoModal msg="Cập nhật thành công." visible={showInfoModal} onPress={handleInfoOk} />
      )}
    </>
  );
};

export default SupplierDetail;

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
  },
  horizontalLine: {
    borderBottomColor: Color.darkerGray,
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});
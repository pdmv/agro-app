import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Color from "../../themes/Color";
import FunctionNav from "../../components/FunctionNav";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import ErrorModal from "../../common/ErrorModal";
import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import MyAuthButton from "../../components/MyAuthButton";
import InfoModal from "../../common/InfoModal";
import LoadingModal from "../../common/LoadingModal";
import { authApi, endpoints, ipDomain } from "../../services/api";
import axios from "axios";

const PriceDetail = () => {
  const navigation = useNavigation();
  const { token } = useSelector((state) => state.auth);
  const route = useRoute();
  const { productId } = route.params;

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [primaryImage, setPrimaryImage] = useState(null);
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState(0);

  const [detail, setDetail] = useState(null);

  const [initialItemName, setInitialItemName] = useState("");
  const [initialPrice, setInitialPrice] = useState(0);
  const [initialPrimaryImage, setInitialPrimaryImage] = useState(null);

  useEffect(() => {
    getDetail();
  }, []);

  useEffect(() => {
    if (detail) {
      setItemName(detail.itemName);
      setPrice(detail.price);
      setPrimaryImage({ uri: detail.productImages[0].imageUrl });

      // Lưu trữ giá trị ban đầu
      setInitialItemName(detail.itemName);
      setInitialPrice(detail.price);
      setInitialPrimaryImage({ uri: detail.productImages[0].imageUrl });
    }
  }, [detail]);

  const getDetail = async () => {
    let timer;

    try {
      setLoading(true);
      const response = await authApi(token).get(endpoints["price-detail"](productId));
      setDetail(response.data.result);

      timer = setTimeout(() => {
        setLoading(false);
        setShowErrorModal(true);
      }, 1000);

    } catch (error) {
      timer = setTimeout(() => {
        setLoading(false);
        setError({ message: error.response.data.message, code: error.response.data.code });
        setShowErrorModal(true);
      }, 1000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  };

  const handleOk = () => {
    setShowErrorModal(false);
    setError(null);
  };

  const handleInfoOk = () => {
    setShowInfoModal(false);
    navigation.goBack();
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setPrimaryImage(result.assets[0]);
    }
  };

  const handleDelete = () => {
    setPrimaryImage(null);
  };

  const handleUpdate = async () => {
    if (price === 0) {
      setError({ message: "Vui lòng nhập giá bán.", code: 400 });
      setShowErrorModal(true);
      return;
    }

    const hasChanges =
      itemName !== initialItemName ||
      price !== initialPrice ||
      (primaryImage && primaryImage.uri !== initialPrimaryImage.uri);

    if (!hasChanges) {
      setError({ message: "Không có thay đổi nào để cập nhật.", code: 400 });
      setShowErrorModal(true);
      return;
    }

    let timer;

    try {
      setLoading(true);

      const formData = new FormData();
      if (primaryImage && primaryImage.uri !== initialPrimaryImage.uri) {
        formData.append('primaryImage', {
          uri: primaryImage.uri,
          type: primaryImage.mimeType,
          name: primaryImage.fileName,
        });
      }

      formData.append('productId', detail.product.id);
      formData.append('itemName', itemName);
      formData.append('price', price);

      const url = `${ipDomain}/agro${endpoints["update-prices"](detail.id)}`;

      console.log(url);

      const upload = await axios.post(url, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      timer = setTimeout(() => {
        setLoading(false);
        setShowInfoModal(true);
      }, 1000);
    } catch (error) {
      timer = setTimeout(() => {
        setLoading(false);
        setError({ message: error.response.data.message, code: error.response.data.code });
        setShowErrorModal(true);
      }, 1000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{ flex: 1, padding: 16 }}
        >
          {detail && (
            <>
              <View style={[styles.contentWrapper, { marginBottom: 16 }]}>
                <View style={styles.content}>
                  <Text style={styles.title}>Tên mặt hàng</Text>
                  <Text style={styles.value}>{detail.product.name}</Text>
                </View>

                <View style={styles.horizontalLine} />

                <View style={styles.content}>
                  <Text style={styles.title}>Tên hiển thị</Text>
                  <TextInput
                    style={styles.value}
                    placeholder="Nhập tên hiển thị"
                    value={itemName}
                    onChangeText={(text) => setItemName(text)}
                  />
                </View>

                <View style={styles.horizontalLine} />

                <View style={styles.content}>
                  <Text style={styles.title}>Giá bán (VNĐ)</Text>
                  <TextInput
                    style={styles.value}
                    placeholder="Nhập giá bán"
                    keyboardType="numeric"
                    value={String(price)} // Đảm bảo giá bán là chuỗi
                    onChangeText={(text) => setPrice(Number(text))}
                  />
                </View>
              </View>

              <View style={[styles.contentWrapper, { marginBottom: 16 }]}>
                <View style={styles.content}>
                  <Text style={styles.title}>Ảnh sản phẩm</Text>
                </View>

                <View style={styles.horizontalLine} />

                {primaryImage === null && (
                  <TouchableOpacity style={styles.primaryImage} onPress={pickImage}>
                    <Feather name="plus" size={25} color={Color.darkestGray} />
                  </TouchableOpacity>
                )}
                {primaryImage && (
                  <View style={styles.imageWrapper}>
                    <Image source={{ uri: primaryImage.uri }} style={styles.image} />
                    <TouchableOpacity style={styles.deleteWrapper} onPress={handleDelete}>
                      <Feather name="x" size={16} style={styles.deleteIcon} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <MyAuthButton text="Cập nhật" onPress={handleUpdate} />
            </>
          )}
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

      {showInfoModal && (
        <InfoModal msg="Cập nhật thành công." visible={showInfoModal} onPress={handleInfoOk} />
      )}

      {loading && <LoadingModal visible={loading} />}
    </>
  );
};

export default PriceDetail;

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
    textAlign: 'right',
  },
  horizontalLine: {
    borderBottomColor: Color.darkerGray,
    borderBottomWidth: 1,
    marginVertical: 10,
  },

  primaryImage: {
    width: 100,
    height: 100,
    backgroundColor: Color.gray,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Color.darkerGray,
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 16,
    marginBottom: 10,
  },
  deleteWrapper: {
    position: 'absolute',
    right: 5,
    top: 5,
    backgroundColor: Color.gray,
    borderRadius: 20,
    padding: 2,
    borderWidth: 1,
    borderColor: Color.darkerGray,
  },
  deleteIcon: {
    color: Color.darkestGray,
  },

  imageWrapper: {
    width: 100,
    height: 100,
  },
});
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Color from "../../themes/Color";
import FunctionNav from "../../components/FunctionNav";
import { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import API, { authApi, endpoints, ipDomain } from "../../services/api"
import ErrorModal from "../../common/ErrorModal";
import { PurchaseProductContext } from "../../contexts/PurchaseProductContext";
import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import MyAuthButton from "../../components/MyAuthButton";
import InfoModal from "../../common/InfoModal";
import axios from "axios";
import LoadingModal from "../../common/LoadingModal";

const CreatePrice = () => {
  const navigation = useNavigation();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [primaryImage, setPrimaryImage] = useState(null);
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState(0);

  const { selectedProducts, setSelectedProducts } = useContext(PurchaseProductContext);
  const { token } = useSelector((state) => state.auth);


  const handleSelectProduct = () => {
    setSelectedProducts([]);
    navigation.navigate("SelectProduct");
  }

  const handleOk = () => {
    setShowErrorModal(false);
    setError(null);
  }

  const handleInfoOk = () => {
    setSelectedProducts([]);
    setShowInfoModal(false);
    navigation.goBack();
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      // console.log(result);
      setPrimaryImage(result.assets[0]);
    }
  };

  const handleDelete = () => {
    setPrimaryImage(null);
  }

  const handleCreate = async () => {
    if (selectedProducts.length === 0) {
      setError({ message: "Vui lòng chọn mặt hàng.", code: 400 });
      setShowErrorModal(true);
      return;
    }

    if (price === 0) {
      setError({ message: "Vui lòng nhập giá bán.", code: 400 });
      setShowErrorModal(true);
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('primaryImage', {
        uri: primaryImage.uri,
        type: primaryImage.mimeType,
        name: primaryImage.fileName,
      });

      formData.append('productId', selectedProducts[0].productId)
      if (itemName === '') {
        formData.append('itemName', selectedProducts[0].productName)
      } else {
        formData.append('itemName', itemName);
      }
      formData.append('price', price);

      const url = `${ipDomain}/agro${endpoints["list-price"]}`;

      const response = await axios.post(url, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

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
      console.log(error);
      setError({ message: error.response.data.message, code: error.response.data.code });
      setShowErrorModal(true);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{ flex: 1, padding: 16 }}
        >
          <FunctionNav title="Chọn mặt hàng" rightIcon="chevron-right" onPress={() => handleSelectProduct()} />
          
          {selectedProducts.length > 0 && (
            <>
              <View style={[styles.contentWrapper, { marginBottom: 16 }]}>
                <View style={styles.content}>
                  <Text style={styles.title}>Tên mặt hàng</Text>
                  <Text style={styles.value}>{selectedProducts[0].productName}</Text>
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
                    value={price}
                    onChangeText={(text) => setPrice(text)}
                  />
                </View>
              </View>

              <View style={[styles.contentWrapper, { marginBottom: 16 }]}>
                <View style={styles.content}>
                  <Text style={styles.title}>Chọn ảnh sản phẩm</Text>
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
            </>
          )}

          <MyAuthButton text="Đăng bán" onPress={handleCreate}  />
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
        <InfoModal msg="Đăng bán thành công." visible={showInfoModal} onPress={handleInfoOk} />
      )}

      {loading && <LoadingModal visible={loading} />}
    </>
  );
};

export default CreatePrice;

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
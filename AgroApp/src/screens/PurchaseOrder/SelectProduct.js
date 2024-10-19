import { Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import SearchBar from "../../components/SearchBar";
import ErrorModal from "../../common/ErrorModal";
import { useState, useEffect, useContext } from "react";
import { authApi, endpoints } from "../../services/api";
import { useSelector } from "react-redux";
import FunctionNav from "../../components/FunctionNav";
import Color from "../../themes/Color";
import FilterOptions from "../../components/FilterOptions";
import { useNavigation, useRoute } from "@react-navigation/native";
import { PurchaseProductContext } from "../../contexts/PurchaseProductContext";

const SelectProduct = () => {
  const navigation = useNavigation();
  const { token } = useSelector((state) => state.auth);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState('name');

  const [list, setList] = useState([]);
  const { selectedProducts, setSelectedProducts } = useContext(PurchaseProductContext);


  const handleOk = () => {
    setShowErrorModal(false);
    setError(null);
  }

  const handleFilterSelect = (option) => {
    setSelectedFilter(option);
  };

  const handleSearch = async () => {
    try {
      const response = await authApi(token).get(`${endpoints["product"]}?name=${searchText}`);
      setList(response.data.result);
    } catch (error) {
      setError({ message: error.response.data.message, code: error.response.data.code });
      setShowErrorModal(true);
    }
  }

  useEffect(() => {
    if (searchText.trim() !== '') {
      const timeoutId = setTimeout(() => {
        handleSearch();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchText, selectedFilter]);

  const handleDetail = ({ item }) => {
    setSelectedProducts(prevSelectedProducts => {
      const existingProduct = prevSelectedProducts.find(product => product.productId === item.id);

      if (existingProduct) {
        return prevSelectedProducts.map(product =>
          product.productId === item.id
            ? { ...product, quantity: product.quantity + 1 }
            : product
        );
      } else {
        return [
          ...prevSelectedProducts,
          {
            productId: item.id,
            productName: item.name,
            quantity: 1,
            expectedPrice: 0,
          }
        ];
      }
    });

    console.log(selectedProducts);
    navigation.goBack();
  }

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <SearchBar
            placeholder="Tìm kiếm theo tên mặt hàng"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
          />

          <ScrollView style={{ marginTop: 20, paddingHorizontal: 16, }}>
            {list && list.map((item) => {
              return (
                <FunctionNav key={item.id} title={item.name} leftIcon="package" rightIcon="chevron-right" onPress={() => handleDetail({ item })} />
              );
            })}
          </ScrollView>

        </View>
      </TouchableWithoutFeedback>

      {/* Error Modal */}
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

export default SelectProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
});
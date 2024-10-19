import { Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import SearchBar from "../../components/SearchBar";
import ErrorModal from "../../common/ErrorModal";
import { useState, useEffect } from "react";
import { authApi, endpoints } from "../../services/api";
import { useDispatch, useSelector } from "react-redux";
import FunctionNav from "../../components/FunctionNav";
import Color from "../../themes/Color";
import { useNavigation } from "@react-navigation/native";
import FilterOptions from "../../components/FilterOptions";
import { addToCart } from "../../redux/cartSlice";

const SearchOrder = () => {
  const navigation = useNavigation();
  const { token, user } = useSelector((state) => state.auth);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();

  const [selectedFilter, setSelectedFilter] = useState('customerName');
  const filterOptions = [
    { label: 'Tên khách hàng', value: 'customerName' },
    { label: 'ID', value: 'id' },
  ];

  const [list, setList] = useState([]);

  const handleOk = () => {
    setShowErrorModal(false);
    setError(null);
  }

  const handleFilterSelect = (option) => {
    setSelectedFilter(option);
  };

  const handleSearch = async () => {
    try {
      const response = await authApi(token).get(`${endpoints["orders"]}?${selectedFilter}=${searchText}`);
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
  }, [searchText]);

  const handleDetail = ({ item }) => {
    navigation.navigate("PriceDetail", {
      productId: item.product.id
    });
  }

  const handleAddToCart = ({ item }) => {
    const product = {
      id: item.id,
      name: item.itemName,
      price: parseFloat(item.price),
      image: item.productPrimaryImage,
    };
    dispatch(addToCart(product));
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <SearchBar
            placeholder="Tìm kiếm"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
          />

          <FilterOptions
            options={filterOptions}
            selectedOption={selectedFilter}
            onSelect={handleFilterSelect}
          />

          <ScrollView style={{ marginTop: 20, paddingHorizontal: 16, }}>
            {list && list.map((item) => {
              return (
                <FunctionNav
                  key={item.id}
                  title={item.customer.lastname + ' ' + item.customer.firstname}
                  leftIcon="file-text"
                  rightIcon="chevron-right"
                  purchaseCreatedAt={item.createdAt}
                  onPress={() => handleDetail(item.id)}
                />
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

export default SearchOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
});
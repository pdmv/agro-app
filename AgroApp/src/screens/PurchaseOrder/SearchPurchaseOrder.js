import { Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import SearchBar from "../../components/SearchBar";
import ErrorModal from "../../common/ErrorModal";
import { useState, useEffect } from "react";
import { authApi, endpoints } from "../../services/api";
import { useSelector } from "react-redux";
import FunctionNav from "../../components/FunctionNav";
import Color from "../../themes/Color";
import { useNavigation } from "@react-navigation/native";
import FilterOptions from "../../components/FilterOptions";

const SearchPurchaseOrder = () => {
  const navigation = useNavigation();
  const { token } = useSelector((state) => state.auth);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const filterOptions = [
    { label: 'Tên nhà cung cấp', value: 'supplierName' },
    { label: 'Mã đơn nhập hàng', value: 'id' },
  ];
  const [selectedFilter, setSelectedFilter] = useState('supplierName');

  const [list, setList] = useState([]);

  const handleOk = () => {
    setShowErrorModal(false);
    setError(null);
  }

  const handleFilterSelect = (option) => {
    setSelectedFilter(option);
    console.log('Lọc theo:', option);
  };

  const handleSearch = async () => {
    try {
      const response = await authApi(token).get(`${endpoints["purchase-order"]}?${selectedFilter}=${searchText}`);
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

  const handleDetail = (id) => {
    navigation.navigate("PurchaseOrderDetail", { id: id })
  }

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
                  title={item.supplier.name}
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

export default SearchPurchaseOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
});
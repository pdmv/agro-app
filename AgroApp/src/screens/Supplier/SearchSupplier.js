import { Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import SearchBar from "../../components/SearchBar";
import ErrorModal from "../../common/ErrorModal";
import { useState, useEffect } from "react";
import { authApi, endpoints } from "../../services/api";
import { useSelector } from "react-redux";
import FunctionNav from "../../components/FunctionNav";
import Color from "../../themes/Color";
import FilterOptions from "../../components/FilterOptions";
import { useNavigation } from "@react-navigation/native";

const SearchSupplier = () => {
  const navigation = useNavigation();
  const { token } = useSelector((state) => state.auth);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState('name');
  const filterOptions = [
    { label: 'Tên', value: 'name' },
    { label: 'Số điện thoại', value: 'phoneNumber' },
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
      const response = await authApi(token).get(`${endpoints["supplier"]}?${selectedFilter}=${searchText}`);
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
    navigation.navigate("SupplierDetail", { item });
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
                <FunctionNav key={item.id} title={item.name} leftIcon="truck" rightIcon="chevron-right" onPress={() => handleDetail({ item })} />
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

export default SearchSupplier;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
});
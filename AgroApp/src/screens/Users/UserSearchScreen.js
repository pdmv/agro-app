import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { useState, useEffect } from 'react';
import FilterOptions from "../../components/FilterOptions";
import SearchBar from "../../components/SearchBar";
import ListUserScreen from "./ListUserScreen";
import { useSelector } from "react-redux";
import { authApi, endpoints } from "../../services/api";

const UserSearchScreen = () => {
  const { token } = useSelector(state => state.auth);

  const [selectedFilter, setSelectedFilter] = useState('name');
  const filterOptions = [
    { label: 'Tên', value: 'name' },
    { label: 'Số điện thoại', value: 'phoneNumber' },
    { label: 'Email', value: 'email' },
    { label: 'Địa chỉ', value: 'address' },
    { label: 'Tên đăng nhập', value: 'username' },
  ];
  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [error, setError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleFilterSelect = (option) => {
    setSelectedFilter(option);
    console.log('Lọc theo:', option);
  };

  const handleSearch = async () => {
    if (searchText.trim() !== '') {
      try {
        const response = await authApi(token).get(`${endpoints["get-users"]}?${selectedFilter}=${searchText}`);

        setFilteredUsers(response.data.result);
      } catch (error) {
        console.log(error.response.data);
        if (error.response) {
          setError({ message: error.response.data.message, code: error.response.data.code });
        }
        setError({ message: error.response ? error.response.data : error.message, code: error.response ? error.response.status : 'UNKNOWN' });
      }
    } else {
      setFilteredUsers([]);
    };
  };

  useEffect(() => {
    if (searchText.trim() !== '') {
      const timeoutId = setTimeout(() => {
        handleSearch();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchText, selectedFilter]);

  const handleOk = () => {
    setShowErrorModal(false);
    setError(null);
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

          <ListUserScreen users={filteredUsers} />
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

export default UserSearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
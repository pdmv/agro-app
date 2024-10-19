import { StyleSheet, TextInput, View } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import Color from "../themes/Color";

const SearchBar = ({ placeholder, value, onChangeText, onSubmitEditing }) => {
  return (
    <View style={styles.searchBarContainer}>
      <View style={styles.searchBarWrapper}>
        <Feather name="search" size={24} color={Color.primary} />
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          style={{ flex: 1, marginLeft: 10, fontSize: 16, color: Color.black }}
        />
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchBarContainer: {
    backgroundColor: Color.white,
    padding: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: Color.gray,
    borderTopColor: Color.gray,
  },
  searchBarWrapper: {
    backgroundColor: Color.gray,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  },
});
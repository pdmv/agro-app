import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Color from "../themes/Color";
import Feather from '@expo/vector-icons/Feather';

const FilterOptions = ({ options, selectedOption, onSelect }) => {
  return (
    <View style={styles.filterWrapper}>
      <Feather name="filter" size={25} color={Color.primary} />
      <View style={styles.verticalLine} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.filterOptionWrapper}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.filterOption,
                selectedOption === option.value ? styles.filterOptionActive : null
              ]}
              onPress={() => onSelect(option.value)}
            >
              <Text style={[
                styles.filterOptionText,
                selectedOption === option.value ? styles.filterOptionTextActive : null
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default FilterOptions;

const styles = StyleSheet.create({
  filterWrapper: {
    backgroundColor: Color.white,
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 10,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Color.gray,
  },
  verticalLine: {
    width: 1,
    height: 24,
    backgroundColor: Color.darkerGray,
    marginHorizontal: 10,
  },
  filterOptionWrapper: {
    flexDirection: 'row',
  },
  filterOption: {
    backgroundColor: Color.gray,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 9,
    marginHorizontal: 5,
    alignContent: 'center',
    justifyContent: 'center',
  },
  filterOptionActive: {
    backgroundColor: Color.primary,
  },
  filterOptionText: {
    color: Color.darkestGray,
    fontWeight: 'bold',
  },
  filterOptionTextActive: {
    color: Color.white,
  },
});
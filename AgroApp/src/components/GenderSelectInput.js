import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import Color from "../themes/Color";
import { useState, useEffect } from "react";

export default GenderSelectInput = ({ gender, setGender }) => {

  useEffect(() => {
    if (gender === null || gender === undefined) {
      setGender('MALE');
    }
  }, []);

  const handlePress = (selectedGender) => {
    setGender(selectedGender);
  };

  return (
    <View style={styles.container}>
      <Feather name="user" size={24} color={Color.primary} style={styles.leftIcon} />
      <Text style={styles.text}>Giới tính</Text>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.option,
            styles.optionFirst,
            {
              backgroundColor: gender === 'MALE' ? Color.primary : Color.white,
              borderWidth: gender === 'MALE' ? 0 : 1,
              paddingHorizontal: gender === 'MALE' ? 10 : 8,
              paddingVertical: gender === 'MALE' ? 7 : 5,
            }
          ]}
          onPress={() => handlePress('MALE')}
        >
          <Text style={[
            styles.optionText,
            {
              color: gender === 'MALE' ? Color.secondary : 'gray',
              fontWeight: gender === 'MALE' ? 'bold' : 'normal'
            }
          ]}>Nam</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.option,
            styles.optionSecond,
            {
              backgroundColor: gender === 'FEMALE' ? Color.primary : Color.white,
              borderWidth: gender === 'FEMALE' ? 0 : 1,
              paddingHorizontal: gender === 'FEMALE' ? 12 : 10,
              paddingVertical: gender === 'FEMALE' ? 7 : 5,
            }
          ]}
          onPress={() => handlePress('FEMALE')}
        >
          <Text style={[
            styles.optionText,
            {
              color: gender === 'FEMALE' ? Color.secondary : 'gray',
              fontWeight: gender === 'FEMALE' ? 'bold' : 'normal'
            }
          ]}>Nữ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.option,
            styles.optionThird,
            {
              backgroundColor: gender === 'OTHER' ? Color.primary : Color.white,
              borderWidth: gender === 'OTHER' ? 0 : 1,
              paddingHorizontal: gender === 'OTHER' ? 10 : 8,
              paddingVertical: gender === 'OTHER' ? 7 : 5,
            }
          ]}
          onPress={() => handlePress('OTHER')}
        >
          <Text style={[
            styles.optionText,
            {
              color: gender === 'OTHER' ? Color.secondary : 'gray',
              fontWeight: gender === 'OTHER' ? 'bold' : 'normal'
            }
          ]}>Khác</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.gray,
    height: 60,
    minWidth: 330,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: Color.gray,
  },
  leftIcon: {
    marginLeft: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 8,
  },
  option: {
    paddingVertical: 5,
    marginRight: 1,
    borderColor: Color.secondary,
  },
  optionFirst: {
    borderTopStartRadius: 5,
    borderBottomStartRadius: 5,
  },
  optionSecond: {
  },
  optionThird: {
    borderTopEndRadius: 5,
    borderBottomEndRadius: 5,
  },
  optionText: {
    fontSize: 16,
    color: 'gray'
  },
  text: {
    fontSize: 18,
    marginLeft: 14,
    color: Color.text,
  }
});
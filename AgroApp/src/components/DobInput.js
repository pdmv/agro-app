import { StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import { useState } from "react";
import Feather from '@expo/vector-icons/Feather';
import Color from "../themes/Color";
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDate } from '../utils/dateUtils';

export default DobInput = ({ dob, setDob, icon }) => {
  const [isFocus, setIsFocus] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setDob(currentDate);
    setShowPicker(false);
    setIsFocus(false);
  };

  const handleFocus = () => {
    setIsFocus(true);
    setShowPicker(true);
  };

  const onPress = () => {
    handleFocus();
  };

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[
        styles.container,
        { borderColor: isFocus ? Color.onFocus : Color.gray }
      ]}>
        <Feather name={icon} size={24} color={Color.primary} />
        <View style={styles.textContainer}>
          {showPicker && (
            <DateTimePicker
              value={dob}
              mode="date"
              display="default"
              onChange={onChange}
            />
          )}
          {!showPicker && (
            <Text style={styles.text}>
              {formatDate(dob)}
            </Text>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.gray,
    padding: 16,
    height: 60,
    minWidth: 330,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: Color.gray,
  },
  textContainer: {
    flex: 1,
    marginLeft: 14,
  },
  text: {
    fontSize: 18,
    color: Color.text,
  }
});
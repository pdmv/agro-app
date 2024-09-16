import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import { useState } from "react";
import Feather from '@expo/vector-icons/Feather';
import Color from "../themes/Color";

export default MyIconTextInput = ({ text, setText, icon, placeholder, isPassword=false }) => {
  const [secure, setSecure] = useState(isPassword);
  const [isFocus, setIsFocus] = useState(false);

  const changeText = (text) => {
    setText(text);

    if (text == '') {
      setSecure(true);
    }
  }

  return (
    <View style={[
      styles.container,
      { borderColor: isFocus ? Color.onFocus : Color.whiteBackground }
    ]}>
      <Feather name={isPassword ? "lock" : icon} size={24} color={isFocus ? Color.onFocus : Color.icon} />
      <TextInput
        style={styles.text}
        placeholder={placeholder}
        value={text}
        onChangeText={text => changeText(text)}
        secureTextEntry={secure && isPassword}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
      />
      {isPassword && <>
        <TouchableOpacity style={{ marginLeft: 14 }}>
          <Feather
            name={secure ? "eye-off" : "eye"}
            size={24}
            color={isFocus ? Color.onFocus : Color.icon}
            onPress={() => setSecure(!secure)}
          />
        </TouchableOpacity>
      </>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.whiteBackground,
    padding: 16,
    height: 60,
    minWidth: 330,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: Color.whiteBackground,
  },
  text: {
    flex: 1,
    fontSize: 18,
    marginLeft: 14,
    color: Color.text,
  }
});
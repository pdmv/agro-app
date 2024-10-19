import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import { useState } from "react";
import Feather from '@expo/vector-icons/Feather';
import Color from "../themes/Color";

export default MyIconTextInput = ({
  text, setText, icon, placeholder, isPassword = false, isPhoneNumber = false, isEmail = false
}) => {
  const [secure, setSecure] = useState(isPassword);
  const [isFocus, setIsFocus] = useState(false);

  const changeText = (text) => {
    setText(text);

    if (text == '') {
      setSecure(true);
    }
  }

  const keyboardType = () => {
    if (isPhoneNumber) return "phone-pad";
    if (isEmail) return "email-address";
    return "default";
  };

  return (
    <View style={[
      styles.container,
      { borderColor: isFocus ? Color.primary : Color.gray }
    ]}>
      <Feather name={isPassword ? "lock" : icon} size={24} color={Color.primary} />
      <TextInput
        style={styles.text}
        placeholder={placeholder}
        value={text}
        onChangeText={text => changeText(text)}
        secureTextEntry={secure && isPassword}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        keyboardType={keyboardType()}
      />
      {isPassword && <>
        <TouchableOpacity style={{ marginLeft: 14 }}>
          <Feather
            name={secure ? "eye-off" : "eye"}
            size={24}
            color={Color.primary}
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
    backgroundColor: Color.gray,
    padding: 16,
    height: 60,
    minWidth: 330,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: Color.gray,
  },
  text: {
    flex: 1,
    fontSize: 18,
    marginLeft: 14,
    color: Color.primary,
  }
});
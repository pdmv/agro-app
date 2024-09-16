import { Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useState } from "react";
import MyIconTextInput from "../components/MyIconTextInput";
import Color from "../themes/Color";
import { useDispatch, useSelector } from "react-redux";
import MyAuthButton from "../components/MyAuthButton";
import { loginThunk } from "../redux/authSlice";

const appIcon = require('../../assets/Images/app-icon.png');

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  const handleLogin = () => {
    dispatch(loginThunk({ username, password }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Image source={appIcon} style={styles.image} />
            <Text style={styles.title}>Agro Market</Text>
          </View>
          <View style={styles.content}>
            <MyIconTextInput text={username} setText={setUsername} icon="user" placeholder="Tên đăng nhập" />
            <MyIconTextInput text={password} setText={setPassword} placeholder="Mật khẩu" isPassword={true} />
            <MyAuthButton text="Đăng nhập" onPress={handleLogin} status={status} error={error} />
            <View style={styles.subTitleContainer}>
              <Text style={{ color: Color.text }}>Bạn chưa có tài khoản?</Text>
              <TouchableOpacity style={{ marginLeft: 5 }}>
                <Text style={{ color: Color.title, fontWeight: 'bold' }}>Đăng ký ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
          </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView >
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
    padding: 16,
  },
  titleContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  content: {
    flex: 3,
    alignItems: 'center',
  },
  image: {
    height: 90,
    width: 90,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Color.title,
    marginTop: 15,
  },
  subTitleContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
});
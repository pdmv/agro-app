import { Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useState, useEffect } from "react";
import MyIconTextInput from "../components/MyIconTextInput";
import Color from "../themes/Color";
import { useDispatch, useSelector } from "react-redux";
import MyAuthButton from "../components/MyAuthButton";
import { getProfileThunk, loginThunk, resetError, resetStatus } from "../redux/authSlice";
import ErrorModal from "../common/ErrorModal";

const appIconTitle = require('../../assets/Images/app_icon_title.png');

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { isAuthenticated, status, error, token } = useSelector((state) => state.auth);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (error) {
      setShowErrorModal(true);
    }
  }, [error]);

  const handleLogin = async () => {
    dispatch(loginThunk({ username, password }));
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(getProfileThunk(token));
      navigation.goBack();
    }
  }, [isAuthenticated, token, dispatch]);

  const handleOk = () => {
    setShowErrorModal(false);
    dispatch(resetError());
    dispatch(resetStatus());
  };

  const handleRegister = () => {
    navigation.navigate("RegisterStack", { screen: 'Register' });
  };

  return (
    <>
      {/* Error Modal */}
      {error && showErrorModal && (
        <ErrorModal
          errorCode={error.code}
          msg={error.message}
          visible={showErrorModal}
          onPress={handleOk}
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <Image source={appIconTitle} style={styles.image} />
            </View>
            <View style={styles.content}>
              <MyIconTextInput text={username} setText={setUsername} icon="user" placeholder="Tên đăng nhập" />
              <MyIconTextInput text={password} setText={setPassword} placeholder="Mật khẩu" isPassword={true} />
              <MyAuthButton text="Đăng nhập" onPress={handleLogin} status={status} error={error} />
              <View style={styles.subTitleContainer}>
                <Text style={{ color: Color.text }}>Bạn chưa có tài khoản?</Text>
                <TouchableOpacity style={{ marginLeft: 5 }} onPress={handleRegister}>
                  <Text style={{ color: Color.title, fontWeight: 'bold' }}>Đăng ký ngay</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView >
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
    padding: 16,
  },
  headerContainer: {
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
    height: 200,
    width: 200,
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
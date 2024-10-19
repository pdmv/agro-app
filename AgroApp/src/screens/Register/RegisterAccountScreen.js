import React, { useState, useEffect } from "react";
import { Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Color from "../../themes/Color";
import MyIconTextInput from "../../components/MyIconTextInput";
import MyAuthButton from "../../components/MyAuthButton";
import Feather from '@expo/vector-icons/Feather';
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import LoadingModal from '../../common/LoadingModal';
import ErrorModal from '../../common/ErrorModal';
import InfoModal from '../../common/InfoModal';
import { registerThunk, resetError, resetStatus } from '../../redux/authSlice'; // Assuming you have a thunk for registration

const appIconTitle = require('../../../assets/Images/app_icon_title_horizontal.png');

const RegisterAccountScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth); // Assuming you store status and error in auth slice

  const { user } = route.params;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (status === 'registering') {
      setLoading(true);
    } else if (status === 'register_succeeded') {
      timeoutId = setTimeout(() => {
        setLoading(false);
        setShowInfoModal(true);
      }, 1000);
    } else if (status === 'register_failed') {
      timeoutId = setTimeout(() => {
        setLoading(false);
        setShowErrorModal(true);
      }, 1000); 
    } else {
      setLoading(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [status]);

  const handleRegister = () => {
    if (password === confirmPassword) {
      const completeUser = {
        ...user,
        account: {
          username,
          password,
        },
      };
      dispatch(registerThunk(completeUser));
    } else {
      alert("Mật khẩu không khớp!");
    }
  };

  const handleErrorOk = () => {
    setShowErrorModal(false);
    dispatch(resetError());
    dispatch(resetStatus());
  };

  const handleInfoOk = () => {
    setShowInfoModal(false);
    dispatch(resetStatus());
    navigation.navigate("Login"); // Navigate to login or another screen
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Image source={appIconTitle} style={styles.image} />
            <Text style={styles.title}>Tạo tài khoản</Text>
          </View>
          <View style={styles.contentContainer}>
            <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
              <MyIconTextInput icon="user" placeholder="Tên đăng nhập" text={username} setText={setUsername} />
              <MyIconTextInput icon="lock" placeholder="Mật khẩu" text={password} setText={setPassword} isPassword={true} />
              <MyIconTextInput icon="lock" placeholder="Xác nhận mật khẩu" text={confirmPassword} setText={setConfirmPassword} isPassword={true} />
              <MyAuthButton text="Đăng ký" leftIcon="check" onPress={handleRegister} />
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <View style={styles.buttonContainer}>
                  <View style={styles.buttonWrapper}>
                    <Feather name="arrow-left" size={22} color={Color.primary} style={{ marginRight: 10 }} />
                    <Text style={styles.buttonText}>Quay lại</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* Loading Modal */}
      {loading && <LoadingModal visible={loading} />}

      {/* Error Modal */}
      {showErrorModal && (
        <ErrorModal
          errorCode={error.code}
          msg={error.message}
          visible={showErrorModal}
          onPress={handleErrorOk}
        />
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <InfoModal msg="Đăng ký thành công!" visible={showInfoModal} onPress={handleInfoOk} />
      )}
    </KeyboardAvoidingView>
  );
};

export default RegisterAccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
    alignItems: 'center',
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  image: {
    height: 180,
    width: 280,
  },
  contentContainer: {
    flex: 3,
    width: 380,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Color.primary,
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.secondary,
    padding: 16,
    height: 60,
    minWidth: 330,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: Color.primary,
  },
  buttonText: {
    color: Color.primary,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
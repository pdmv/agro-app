import React, { useState, useEffect } from "react";
import { Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Color from "../../themes/Color";
import MyIconTextInput from "../../components/MyIconTextInput";
import MyAuthButton from "../../components/MyAuthButton";
import Feather from '@expo/vector-icons/Feather';
import { useNavigation, useRoute } from "@react-navigation/native";
import LoadingModal from '../../common/LoadingModal';
import InfoModal from '../../common/InfoModal';
import { sendOTP, confirmCode } from "../../configs/firebaseConfig";

const appIconTitle = require('../../../assets/Images/app_icon_title_horizontal.png');

const PhoneNumberAuthentication = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = route.params;

  const [loading, setLoading] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [code, setCode] = useState('');

  const [counter, setCounter] = useState(300);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (user !== null || user !== undefined) {
      const phoneNumber = user.phoneNumber;
      sendOTP({ phoneNumber, setVerificationId });
    }
  }, [user]);

  useEffect(() => {
    if (counter > 0) {
      const timer = setInterval(() => {
        setCounter((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setCanResend(true);
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [counter]);

  const handleInfoOk = () => {
    setShowInfoModal(false);
  };

  const handleContinue = async () => {
    try {
      await confirmCode({ verificationId, code });
      navigation.navigate('RegisterAccount', { user });
    } catch (error) {
      console.log(error);
      setShowInfoModal(true);
    }
  };

  const handleResendOTP = () => {
    if (canResend) {
      sendOTP({ phoneNumber: user.phoneNumber, setVerificationId });
      setCounter(300);
      setCanResend(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Image source={appIconTitle} style={styles.image} />
            <Text style={styles.title}>Xác thực số điện thoại</Text>
          </View>
          <View style={styles.contentContainer}>
            <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
              <MyIconTextInput
                icon="code"
                placeholder="Mã OTP gồm 6 số"
                text={code}
                setText={(value) => setCode(value)}
              />

              

              {/* Resend OTP Button */}
              <View style={styles.resendButtonWrapper}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                  }}
                >
                  <Text>Mã OTP sẽ được gửi đến số điện thoại {user.phoneNumber}</Text>
                  <Text>({counter < 10 ? `0${counter}` : counter}s)</Text>
                </View>

                <TouchableOpacity
                  onPress={handleResendOTP}
                  disabled={!canResend}
                  style={[styles.resendButton, { opacity: canResend ? 1 : 0.5 }]}
                >
                  <Text style={styles.buttonText}>Gửi lại</Text>
                </TouchableOpacity>
              </View>

              <MyAuthButton text="Tiếp tục" leftIcon="arrow-right" onPress={handleContinue} />
              <TouchableOpacity onPress={() => navigation.goBack()}>
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

      {/* Info Modal */}
      {showInfoModal && (
        <InfoModal msg="Mã OTP không hợp lệ!" visible={showInfoModal} onPress={handleInfoOk} />
      )}
    </KeyboardAvoidingView>
  );
}

export default PhoneNumberAuthentication;

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
  resendButtonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendButton: {
    backgroundColor: Color.secondary,
    padding: 10,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
    width: 100,
    marginBottom: 30,
  },
});
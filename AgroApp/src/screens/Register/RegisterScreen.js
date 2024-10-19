import { Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Color from "../../themes/Color";
import MyIconTextInput from "../../components/MyIconTextInput";
import MyAuthButton from "../../components/MyAuthButton";
import GenderSelectInput from "../../components/GenderSelectInput";
import { useState } from "react";
import DobInput from "../../components/DobInput";
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from "@react-navigation/native";
import InfoModal from "../../common/InfoModal";

const appIconTitle = require('../../../assets/Images/app_icon_title_horizontal.png');

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [showInfoModal, setShowInfoModal] = useState(false);

  const [info, setInfo] = useState({
    firstname: '',
    lastname: '',
    address: '',
    phoneNumber: '',
    gender: null,
    dob: new Date(),
    email: ''
  });

  const handleChange = (field, value) => {
    setInfo(prevInfo => ({
      ...prevInfo,
      [field]: value
    }));
  };

  const handleContinue = () => {
    if (info.phoneNumber === '') {
      setShowInfoModal(true);
      return;
    }

    const user = {
      firstname: info.firstname,
      lastname: info.lastname,
      address: info.address,
      phoneNumber: info.phoneNumber,
      gender: info.gender,
      dob: info.dob.toISOString().split('T')[0],
      email: info.email,
      account: {
        username: '',
        password: ''
      }
    };

    navigation.navigate("PhoneNumberAuthentication", { user });
  };

  const handleInfoOk = () => {
    setShowInfoModal(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Image source={appIconTitle} style={styles.image} />
            <Text style={styles.title}>Đăng ký</Text>
          </View>
          <View style={styles.contentContainer}>
            <ScrollView
              style={{ width: '100%' }}
              showsVerticalScrollIndicator={false}
            >
              <MyIconTextInput
                icon="user"
                placeholder="Họ và tên đệm"
                text={info.lastname}
                setText={(value) => handleChange('lastname', value)}
              />
              <MyIconTextInput
                icon="user"
                placeholder="Tên của bạn"
                text={info.firstname}
                setText={(value) => handleChange('firstname', value)}
              />
              <GenderSelectInput
                gender={info.gender}
                setGender={(value) => handleChange('gender', value)}
              />
              <DobInput
                dob={info.dob}
                setDob={(value) => handleChange('dob', value)}
                icon="calendar"
                placeholder="Ngày sinh"
              />
              <MyIconTextInput
                icon="map-pin"
                placeholder="Địa chỉ"
                text={info.address}
                setText={(value) => handleChange('address', value)}
              />
              <MyIconTextInput
                icon="phone"
                placeholder="Số điện thoại"
                isPhoneNumber={true}
                text={info.phoneNumber}
                setText={(value) => handleChange('phoneNumber', value)}
              />
              <MyIconTextInput
                icon="mail"
                placeholder="Email"
                text={info.email}
                setText={(value) => handleChange('email', value)}
                isEmail={true}
              />

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

      {showInfoModal && (
        <InfoModal msg="Các thông tin không được trống!" visible={showInfoModal} onPress={handleInfoOk} />
      )}
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

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
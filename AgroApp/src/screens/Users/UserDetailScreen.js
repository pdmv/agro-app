import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Platform, KeyboardAvoidingView } from "react-native";
import Color from '../../themes/Color';
import Feather from '@expo/vector-icons/Feather';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDate } from '../../utils/dateUtils';
import { useDispatch, useSelector } from 'react-redux';
import { changeRoleUserThunk, registerRoleUserThunk, resetError, resetStatus } from '../../redux/userSlice';
import ErrorModal from '../../common/ErrorModal';
import LoadingModal from '../../common/LoadingModal';
import InfoModal from '../../common/InfoModal';
import { useNavigation, useRoute } from '@react-navigation/native';
import { authApi, endpoints } from '../../services/api';

const genderOptions = [
  { label: "Nam", value: "MALE" },
  { label: "Nữ", value: "FEMALE" },
  { label: "Khác", value: "OTHER" },
];

const roleOptions = [
  { label: "Quản trị viên", value: "ADMIN" },
  { label: "Chủ cửa hàng", value: "OWNER" },
  { label: "Nhân viên", value: "STAFF" },
  { label: "Khách hàng", value: "CUSTOMER" },
];

export default UserDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userId = route.params?.userId;

  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);
  const { status, error } = useSelector(state => state.users);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const [user, setUser] = useState(null);

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState(null);
  const [dob, setDob] = useState(new Date());
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    if (event.type === "set") {
      const currentDate = selectedDate || dob;
      setDob(currentDate);
      setShowDatePicker(false);
    } else {
      setShowDatePicker(false);
    }
  };

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await authApi(token).get(`${endpoints["get-profile"]}?userId=${userId}`);
        setUser(response.data.result);
      } catch (error) {
        console.log(error.response.data);
        if (error.response) {
          resetError({ message: error.response.data.message, code: error.response.data.code });
        }
        resetError({ message: error.response ? error.response.data : error.message, code: error.response ? error.response.status : 'UNKNOWN' });
      }
    };

    getUserProfile();
  }, [userId]);

  useEffect(() => {
    if (user) {
      setFirstname(user.firstname);
      setLastname(user.lastname);
      setAddress(user.address);
      setPhoneNumber(user.phoneNumber);
      setGender(user.gender);
      setDob(new Date(user.dob));
      setEmail(user.email);
      setUsername(user.account.username);
      setRole(user.account.role);
    }
  }, [user]);

  useEffect(() => {
    let timeoutId;

    if (status === 'role_profile_changing') {
      setLoading(true);
    } else if (status === 'role_profile_changed') {
      timeoutId = setTimeout(() => {
        setLoading(false);
        setShowInfoModal(true);
      }, 1000);
    } else if (status === 'changing_role_profile_failed') {
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

  const handleErrorOk = () => {
    setShowErrorModal(false);
    dispatch(resetError());
    dispatch(resetStatus());
  };

  const handleInfoOk = () => {
    setShowInfoModal(false);
    dispatch(resetStatus());
    navigation.goBack();
  };

  const handleAddUser = () => {
    if (password !== confirmPassword) {
      dispatch(resetStatus());
      dispatch(resetError({ message: 'Mật khẩu không khớp!', code: null }));
      setShowErrorModal(true);
      return;
    }

    if (role === null) {
      dispatch(resetStatus());
      dispatch(resetError({ message: 'Vui lòng chọn vai trò!', code: null }));
      setShowErrorModal(true);
      return;
    }

    const userData = {
      firstname,
      lastname,
      address,
      phoneNumber,
      gender,
      dob: dob.toISOString().split('T')[0],
      email,
      account: {
        username,
        password: password !== "" ? password : null,
        role,
      },
    };

    console.log(userData);

    dispatch(changeRoleUserThunk({ token, userId: userId, data: userData }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        <View style={styles.detailsContainer}>
          <ContentView title="Họ" value={lastname} onChangeText={setLastname} placeholder="Nguyễn Văn" />
          <View style={styles.line} />
          <ContentView title="Tên" value={firstname} onChangeText={setFirstname} placeholder="A" />
          <View style={styles.line} />
          <ContentView title="Địa chỉ" value={address} onChangeText={setAddress} placeholder="Số X, đường Y, ..." />
          <View style={styles.line} />
          <ContentView title="Số điện thoại" value={phoneNumber} onChangeText={setPhoneNumber} isPhoneNumber={true} placeholder="0123456789" />
          <View style={styles.line} />
          <View style={styles.content}>
            <Text style={styles.detailTitle}>Giới tính</Text>
            <RNPickerSelect
              onValueChange={(value) => setGender(value)}
              items={genderOptions}
              style={{ ...pickerSelectStyles, inputAndroid: { ...pickerSelectStyles.inputAndroid, textAlign: 'right' }, inputIOS: { ...pickerSelectStyles.inputIOS, textAlign: 'right' } }}
              useNativeAndroidPickerStyle={false}
              fixAndroidTouchableBug={true}
              value={gender}
              placeholder={{ label: "Giới tính", value: null }}
            />
          </View>
          <View style={styles.line} />

          {/* Date Input */}
          {Platform.OS === 'ios' && (
            <View style={styles.content}>
              <Text style={styles.detailTitle}>Ngày sinh</Text>
              <DateTimePicker
                value={dob}
                mode="date"
                onChange={handleDateChange}
              />
            </View>
          )}

          {Platform.OS === "android" && (
            <TouchableOpacity style={styles.content} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.detailTitle}>Ngày sinh</Text>
              <Text style={styles.detailValue}>{formatDate(dob)}</Text>
            </TouchableOpacity>
          )}

          {showDatePicker && (
            <DateTimePicker
              value={dob}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <View style={styles.line} />
          <ContentView title="Email" value={email} onChangeText={setEmail} isEmail={true} placeholder="email@mail.com" />
        </View>

        <View style={styles.detailsContainer}>
          <ContentView title="Tên đăng nhập" value={username} onChangeText={setUsername} placeholder="username" />
          <View style={styles.line} />
          <ContentView title="Mật khẩu" value={password} onChangeText={setPassword} placeholder="password" isPassword={true} />
          <View style={styles.line} />
          <ContentView title="Xác nhận mật khẩu" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="password" isPassword={true} />
          <View style={styles.line} />
          <View style={styles.content}>
            <Text style={styles.detailTitle}>Vai trò</Text>
            <RNPickerSelect
              onValueChange={(value) => setRole(value)}
              items={roleOptions}
              style={{ ...pickerSelectStyles, inputAndroid: { ...pickerSelectStyles.inputAndroid, textAlign: 'right' }, inputIOS: { ...pickerSelectStyles.inputIOS, textAlign: 'right' } }}
              useNativeAndroidPickerStyle={false}
              fixAndroidTouchableBug={true}
              value={role}
              placeholder={{ label: "Vai trò", value: null }}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.editButtonContainer} onPress={handleAddUser}>
          <Feather name="edit" size={22} color={Color.white} style={{ marginRight: 10 }} />
          <Text style={styles.editButton}>Chỉnh sửa</Text>
        </TouchableOpacity>
      </ScrollView>

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
        <InfoModal msg="Chỉnh sửa người dùng thành công!" visible={showInfoModal} onPress={handleInfoOk} />
      )}
    </KeyboardAvoidingView>
  );
};

const ContentView = ({ title, value, onChangeText, placeholder, isPhoneNumber = false, isEmail = false, isPassword = false }) => {
  const keyboardType = () => {
    if (isPhoneNumber) return "phone-pad";
    if (isEmail) return "email-address";
    return "default";
  };

  return (
    <View style={styles.content}>
      <Text style={styles.detailTitle}>{title}</Text>
      <TextInput
        value={value}
        style={[styles.detailValue, { textAlign: 'right' }]}
        onChangeText={onChangeText}
        keyboardType={keyboardType()}
        placeholder={placeholder}
        secureTextEntry={isPassword}
      />
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    color: Color.darkestGray,
    textAlign: 'right', // Canh lề phải cho iOS
  },
  inputAndroid: {
    fontSize: 16,
    color: Color.darkestGray,
    textAlign: 'right', // Canh lề phải cho Android
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Color.gray,
    marginTop: 20,
    borderRadius: 15,
    marginHorizontal: 15,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailTitle: {
    fontSize: 16,
    color: Color.black,
    fontWeight: "bold",
  },
  detailValue: {
    fontSize: 16,
    color: Color.darkestGray,
  },
  line: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 15,
  },
  editButtonContainer: {
    backgroundColor: Color.primary,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 15,
    borderRadius: 15,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  editButton: {
    color: Color.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});
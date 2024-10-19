import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Platform } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { formatDate } from '../../utils/dateUtils';
import LoadingModal from '../../common/LoadingModal';
import Color from '../../themes/Color';
import Feather from '@expo/vector-icons/Feather';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { changeProfileThunk, resetError, resetStatus } from '../../redux/authSlice';
import ErrorModal from '../../common/ErrorModal';
import InfoModal from '../../common/InfoModal';

const genderOptions = [
  { label: "Nam", value: "MALE" },
  { label: "Nữ", value: "FEMALE" },
  { label: "Khác", value: "OTHER" },
];

export default ProfileDetailScreen = ({ navigation }) => {
  const { user, token, error, status } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const [firstname, setFirstname] = useState(user.firstname);
  const [lastname, setLastname] = useState(user.lastname);
  const [address, setAddress] = useState(user.address);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [gender, setGender] = useState(user.gender);
  const [dob, setDob] = useState(new Date(user.dob));
  const [email, setEmail] = useState(user.email);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (status === 'changing_profile') {
      setLoading(true);
    } else if (status === 'profile_changed') {
      timeoutId = setTimeout(() => {
        setLoading(false);
        setShowInfoModal(true);
      }, 1000);
    } else if (status === 'profile_change_failed') {
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

  const handleEdit = () => {
    let data = {
      firstname,
      lastname,
      address,
      phoneNumber,
      gender,
      dob: dob.toISOString(),
      email,
    };

    dispatch(changeProfileThunk({ token, data }));
  };

  const handleDateChange = (event, selectedDate) => {
    if (event.type === "set") {
      const currentDate = selectedDate || dob;
      setDob(currentDate);
      setShowDatePicker(false);
    } else {
      setShowDatePicker(false);
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
    navigation.navigate("Profile");
  };

  if (!user) {
    return <LoadingModal visible={loading} />;
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.detailsContainer}>
          <ContentView title="Họ" value={lastname} onChangeText={setLastname} />
          <View style={styles.line} />
          <ContentView title="Tên" value={firstname} onChangeText={setFirstname} />
          <View style={styles.line} />
          <ContentView title="Địa chỉ" value={address} onChangeText={setAddress} />
          <View style={styles.line} />
          <ContentView title="Số điện thoại" value={phoneNumber} onChangeText={setPhoneNumber} isPhoneNumber={true} />
          <View style={styles.line} />
          <View style={styles.content}>
            <Text style={styles.detailTitle}>Giới tính</Text>
            <RNPickerSelect
              onValueChange={(value) => setGender(value)}
              items={genderOptions}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
              fixAndroidTouchableBug={true}
              value={gender}
              placeholder={{ label: "Chọn giới tính", value: null }}
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
          <ContentView title="Email" value={email} onChangeText={setEmail} isEmail={true} />
        </View>

        <TouchableOpacity style={styles.editButtonContainer} onPress={handleEdit}>
          <Feather name="edit" size={22} color={Color.white} style={{ marginRight: 10 }} />
          <Text style={styles.editButton}>Chỉnh sửa</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Loading Modal */}
      {loading && <LoadingModal visible={loading} />}

      {/* Error Modal */}
      {!loading && error && showErrorModal && (
        <ErrorModal
          errorCode={error.code}
          msg={error.message}
          visible={showErrorModal}
          onPress={handleErrorOk}
        />
      )}

      {/* Info Modal */}
      {!loading && !error && showInfoModal && (
        <InfoModal msg="Chỉnh sửa thông tin thành công." visible={showInfoModal} onPress={handleInfoOk} />
      )}
    </>
  );
};

const ContentView = ({ title, value, onChangeText, isPhoneNumber = false, isEmail = false }) => {
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
        style={styles.detailValue}
        onChangeText={onChangeText}
        keyboardType={keyboardType()}
        placeholder="..."
      />
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    color: Color.darkestGray,
  },
  inputAndroid: {
    fontSize: 16,
    color: Color.darkestGray,
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
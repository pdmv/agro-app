import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from 'react';
import LoadingModal from "../../common/LoadingModal";
import ErrorModal from "../../common/ErrorModal";
import InfoModal from "../../common/InfoModal";
import MyIconTextInput from "../../components/MyIconTextInput";
import Color from "../../themes/Color";
import MyAuthButton from "../../components/MyAuthButton";
import { changePasswordThunk, logout, resetError, resetStatus } from "../../redux/authSlice";

const ChangePasswordScreen = ({ navigation }) => {
  const { user, token, error, status } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (status === 'changing_password') {
      setLoading(true);
    } else if (status === 'password_changed') {
      timeoutId = setTimeout(() => {
        setLoading(false);
        setShowInfoModal(true);
      }, 1000);
    } else if (status === 'password_change_failed') {
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
    dispatch(logout());
  };

  const handleChange = () => { 
    if (newPassword !== confirmPassword) {
      setConfirmError(true);
    } else {
      dispatch(changePasswordThunk({ token, data: { oldPassword: oldPassword, newPassword: newPassword } }));
    }
  };

  const handleOkConfirm = () => {
    setConfirmError(false);
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <MyIconTextInput text={oldPassword} setText={setOldPassword} placeholder="Mật khẩu hiện tại" isPassword={true} />
          
          <View style={styles.wrapper}>
            <MyIconTextInput text={newPassword} setText={setNewPassword} placeholder="Mật khẩu mới" isPassword={true} />
            <MyIconTextInput text={confirmPassword} setText={setConfirmPassword} placeholder="Xác nhận mật khẩu" isPassword={true} />
          </View>
          
          <MyAuthButton text="Đổi mật khẩu" onPress={handleChange} />
        </View>
      </TouchableWithoutFeedback>
      
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

      {/* Error Confirm */}
      {confirmError && (
        <ErrorModal
          errorCode={400}
          msg="Mật khẩu mới không khớp."
          visible={confirmError}
          onPress={handleOkConfirm}
        />
      )}

      {/* Info Modal */}
      {!loading && !error && showInfoModal && (
        <InfoModal msg="Đổi mật khẩu thành công." visible={showInfoModal} onPress={handleInfoOk} />
      )}
    </>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Color.white,
    paddingVertical: 30,
  },
  wrapper: {
    marginTop: 20,
    marginBottom: 5,
  },
});
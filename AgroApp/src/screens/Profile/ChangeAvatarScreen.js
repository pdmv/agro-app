import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Ensure you have this library installed
import { useDispatch, useSelector } from 'react-redux';
import InfoModal from '../../common/InfoModal';
import Color from '../../themes/Color';
import MyAuthButton from '../../components/MyAuthButton';
import { changeAvatarThunk, resetError, resetStatus } from '../../redux/authSlice';
import LoadingModal from '../../common/LoadingModal';
import ErrorModal from '../../common/ErrorModal';

const ChangeAvatarScreen = ({ navigation }) => {
  const [newAvatar, setNewAvatar] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const { user, isAuthenticated, status, error, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();


  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  if (!isAuthenticated) {
    return <InfoModal icon="alert-circle" visible={true} msg="Bạn cần đăng nhập để tiếp tục." onPress={() => navigation.navigate("Login")} />;
  }

  useEffect(() => {
    let timeoutId;

    if (status === 'changing_avatar') {
      setLoading(true);
    } else if (status === 'avatar_changed') {
      timeoutId = setTimeout(() => {
        setLoading(false);
        setShowInfoModal(true);
      }, 1000);
    } else if (status === 'avatar_change_failed') {
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
    navigation.navigate("Profile");
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      // console.log(result);
      setAvatar(result.assets[0]);
      setNewAvatar(true);
    } else {
      setNewAvatar(false);
    }
  };

  const handleSave = () => {
    dispatch(changeAvatarThunk({ token, data: { avatar: avatar } }));
  };

  return (
    <>
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
          <InfoModal msg="Đổi ảnh đại diện thành công." visible={showInfoModal} onPress={handleInfoOk} />
      )}
      
      <View style={styles.container}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarContainer}>
            {newAvatar ? <Image source={{ uri: avatar.uri }} style={styles.avatar} />
              : <Image source={{ uri: user.account.avatarUrl }} style={styles.avatar} />
            }
          </View>
        </View>

        <MyAuthButton text="Chọn ảnh mới" onPress={pickImage} />
        {newAvatar && <>
          <MyAuthButton text="Đổi ảnh đại diện" onPress={handleSave} leftIcon="upload-cloud" />
        </>}
      </View>
    </>        
  );
};

export default ChangeAvatarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Color.white,
  },
  avatarWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: Color.gray,
    padding: 20,
    borderRadius: 28,
    minWidth: 330,
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 270,
    height: 270,
    borderRadius: 135,
    borderWidth: 6,
    borderColor: Color.primary,
  },
  avatar: {
    width: 250,
    height: 250,
    borderRadius: 125,
  },
});
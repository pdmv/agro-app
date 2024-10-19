import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import Color from "../../themes/Color";
import { useDispatch, useSelector } from "react-redux";
import FunctionNav from "../../components/FunctionNav";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from '@expo/vector-icons/Feather';
import { logout } from '../../redux/authSlice';
import InfoModal from "../../common/InfoModal";
import LoadingModal from "../../common/LoadingModal";
import { useState, useEffect } from "react";
import { resetCart } from "../../redux/cartSlice";

const appIcon = require('../../../assets/Images/app_icon.png');

export default ProfileScreen = ({ navigation }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowInfo(true);
    }
  }, [isAuthenticated]);

  const handleToLogin = () => {
    setShowInfo(false);
    navigation.navigate("Home");
  };

  if (!isAuthenticated) {
    return (
      <InfoModal
        icon="alert-circle"
        visible={showInfo}
        msg="Bạn cần đăng nhập để tiếp tục."
        onPress={handleToLogin}
      />
    );
  }

  const handleDetail = () => {
    navigation.navigate("ProfileDetail");
  };

  const handleLogout = () => {
    navigation.navigate("Home");
    dispatch(logout());
    dispatch(resetCart());
  }

  const handleChangeAvatar = () => {
    navigation.navigate("ChangeAvatar");
  }

  const handleChangePassword = () => {
    navigation.navigate("ChangePassword");
  }

  if (!user && isAuthenticated) {
    return <LoadingModal visible={true} />
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Avatar Section */}
      <View style={styles.headerContainer}>
        <View style={styles.avatarContainer}>
          {user?.account?.avatarUrl ? (
            <Image source={{ uri: user.account.avatarUrl }} style={styles.avatarImage} />
          ) : (
            <Image source={appIcon} style={styles.avatarImage} />
          )}
        </View>
        <Text style={styles.nameText}>{`${user.lastname} ${user.firstname}`}</Text>
        <View style={styles.subTitle}>
          <View style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10
          }}>
            <Feather name="mail" size={16} color={Color.darkestGray} style={{ marginRight: 3 }} />
            <Text style={styles.subText}>{user.email}</Text>
          </View>
          <View style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}>
            <Feather name="user" size={16} color={Color.darkestGray} style={{ marginRight: 3 }} />
            <Text style={styles.subText}>{`${user.account.username}`}</Text>
          </View>
        </View>
      </View>

      {/* Function Section */}
      <View style={styles.functionContainer}>
        <ScrollView
          style={{ width: '100%' }}
          showsVerticalScrollIndicator={false}
        >
          <FunctionNav title="Thông tin người dùng" leftIcon="user" rightIcon="chevron-right" onPress={handleDetail} />
          <FunctionNav title="Đổi ảnh đại diện" leftIcon="image" rightIcon="chevron-right" onPress={handleChangeAvatar} />
          <FunctionNav title="Đổi mật khẩu" leftIcon="lock" rightIcon="chevron-right" onPress={handleChangePassword} />
          <FunctionNav title="Đăng xuất" leftIcon="log-out" onPress={handleLogout} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
    alignItems: "center",
  },
  headerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'center',
    marginTop: 18,
    backgroundColor: Color.gray,
    width: '90%',
    borderRadius: 10,
    marginBottom: 18,
  },
  subTitle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 110,
    height: 110,
    borderRadius: 55,
    borderColor: Color.primary,
    borderWidth: 3,
    backgroundColor: Color.white,
    marginBottom: 20,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Color.primary,
  },
  subText: {
    fontSize: 14,
    color: Color.darkestGray,
  },
  functionContainer: {
    flex: 2,
    width: '90%',
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
});
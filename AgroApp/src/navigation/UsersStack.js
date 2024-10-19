import { createStackNavigator } from "@react-navigation/stack";
import { Text, TouchableOpacity, View } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import UsersScreen from "../screens/Users/UsersScreen";
import UserSearchScreen from "../screens/Users/UserSearchScreen";
import UserDetailScreen from "../screens/Users/UserDetailScreen";
import Color from "../themes/Color";
import { useDispatch, useSelector } from "react-redux";
import { getAdminUserThunk, getCustomerUserThunk, getOwnerUserThunk, getStaffUserThunk, resetError, resetStatus } from "../redux/userSlice";
import { useEffect, useState } from 'react';
import ErrorModal from "../common/ErrorModal";
import LoadingModal from "../common/LoadingModal";
import UserInfoScreen from "../screens/Users/UserInfoScreen";

const Stack = createStackNavigator();

export default UsersStack = () => {
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);
  const { status, error } = useSelector(state => state.users);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    dispatch(getAdminUserThunk(token));
    dispatch(getOwnerUserThunk(token));
    dispatch(getStaffUserThunk(token));
    dispatch(getCustomerUserThunk(token));
  }, [dispatch, token]);

  useEffect(() => {
    let timeoutId;

    if (status === 'loading') {
      setLoading(true);
    } else if (status === 'failed') {
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

  if (loading) {
    return <LoadingModal visible={loading} />;
  }

  const handleErrorOk = () => {
    setShowErrorModal(false);
    dispatch(resetError());
    dispatch(resetStatus());
  };

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="UsersScreen"
          component={UsersScreen}
          options={({ navigation }) => ({
            headerShown: true,
            title: "Người dùng",
            headerTitleAlign: 'left',
            headerRight: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "center", backgroundColor: Color.gray, marginRight: 8, borderRadius: 50, paddingHorizontal: 2, }}>
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(getAdminUserThunk(token));
                      dispatch(getOwnerUserThunk(token));
                      dispatch(getStaffUserThunk(token));
                      dispatch(getCustomerUserThunk(token));
                    }}
                    style={{ backgroundColor: Color.gray, borderRadius: 50 }}
                  >
                    <Feather name="refresh-cw" size={23} style={{ padding: 6, color: Color.darkestGray }} />
                  </TouchableOpacity>

                  <View style={{ width: 1, height: 24, backgroundColor: Color.darkerGray, marginHorizontal: 3 }} />

                  <TouchableOpacity onPress={() => navigation.navigate("UserInfo")} style={{ backgroundColor: Color.gray, borderRadius: 50 }}>
                    <Feather name="plus" size={23} style={{ padding: 6, color: Color.darkestGray }} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate("UserSearch")} style={{ backgroundColor: Color.primary, borderRadius: 50, flexDirection: 'row', alignItems: 'center' }}>
                  <Feather name="search" size={23} style={{ padding: 6, color: Color.white }} />
                  <Text style={{ color: Color.white, marginRight: 8 }}>Tìm kiếm</Text>
                </TouchableOpacity>
              </View>
            ),
            headerLeft: () => { }
          })}
        />

        <Stack.Screen
          name="UserSearch"
          component={UserSearchScreen}
          options={({ navigation }) => ({
            headerShown: true,
            title: "Tìm kiếm",
            headerTitleAlign: 'center',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Feather name="arrow-left" size={24} style={{ padding: 10 }} />
              </TouchableOpacity>
            ),
          })}
        />

        <Stack.Screen
          name="UserDetail"
          component={UserDetailScreen}
          options={({ navigation }) => ({
            headerShown: true,
            title: "Chi tiết người dùng",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Feather name="arrow-left" size={24} style={{ padding: 10 }} />
              </TouchableOpacity>
            ),
          })}
        />

        <Stack.Screen
          name="UserInfo"
          component={UserInfoScreen}
          options={({ navigation }) => ({
            headerShown: true,
            title: "Thêm người dùng",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Feather name="arrow-left" size={24} style={{ padding: 10 }} />
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>

      {/* Error Modal */}
      {
        !loading && error && showErrorModal && (
          <ErrorModal
            errorCode={error.code}
            msg={error.message}
            visible={showErrorModal}
            onPress={handleErrorOk}
          />
        )
      }
    </>
  );
};
import 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { Provider, useSelector } from 'react-redux';
import { store } from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import { confirmCode, convertToVietnamPhoneNumber, sendOTP } from './src/configs/firebaseConfig';
import { useState } from 'react';
import { Button, TextInput, View } from 'react-native';
import { SupplierProvider } from './src/contexts/SupplierContext';
import { PurchaseProductProvider } from './src/contexts/PurchaseProductContext';
import { PurchaseOrderProvider } from './src/contexts/PurchaseOrderContext';
// import { PermissionsAndroid } from 'react-native';
// import { useEffect } from 'react';

export default App = () => {
  // useEffect(() => {
  //   PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  // }, []);

  return (
    <Provider store={store}>
      <MainComponent />
    </Provider>
    // <TestAuthComponent />
  );
}

export const MainComponent = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  return (
    <SupplierProvider>
      <PurchaseProductProvider>
        <PurchaseOrderProvider>
          <AppNavigator />
        </PurchaseOrderProvider>
      </PurchaseProductProvider>
    </SupplierProvider>
  );
}

export const TestAuthComponent = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [code, setCode] = useState('');

  const handleSendOTP = () => {
    sendOTP({ phoneNumber, setVerificationId });
  };

  const handleConfirmCode = () => {
    confirmCode({ verificationId, code });
  };

  return (
    <View style={styles.container}>
      {!verificationId ? (
        <>
          <TextInput
            placeholder="Nhập số điện thoại"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <Button title="Gửi OTP" onPress={handleSendOTP} />
        </>
      ) : (
        <>
          <TextInput
            placeholder="Nhập mã OTP"
            value={code}
            onChangeText={setCode}
          />
          <Button title="Xác nhận mã" onPress={handleConfirmCode} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import { StyleSheet } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import { Provider, useSelector } from 'react-redux';
import { store } from './src/redux/store';
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
  );
}

export const MainComponent = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  return (
    <>
      {isAuthenticated ? <></> : <LoginScreen />}
    </>
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

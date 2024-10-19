import auth from '@react-native-firebase/auth';

const sendOTP = async ({ phoneNumber, setVerificationId }) => {
  try {
    const validPhoneNumber = convertToVietnamPhoneNumber(phoneNumber);
    const confirmation = await auth().signInWithPhoneNumber(validPhoneNumber);
    setVerificationId(confirmation.verificationId);
  } catch (error) {
    console.error(error);
  }
};

const confirmCode = async ({ verificationId, code }) => {
  const credential = auth.PhoneAuthProvider.credential(verificationId, code);
  await auth().signInWithCredential(credential);
};

function convertToVietnamPhoneNumber(phoneNumber) {
  if (phoneNumber.startsWith('0')) {
    return '+84' + phoneNumber.slice(1);
  }
  return phoneNumber;
}

export { sendOTP, confirmCode, convertToVietnamPhoneNumber };
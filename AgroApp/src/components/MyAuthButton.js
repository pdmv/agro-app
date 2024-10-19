import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Color from "../themes/Color";
import Feather from '@expo/vector-icons/Feather';


export default MyAuthButton = ({ text, onPress, status, leftIcon }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        {status === 'loading' ? <ActivityIndicator color="gray" /> : <>
          <View style={styles.wrapper}>
            {leftIcon ? <Feather name={leftIcon} size={22} color={Color.white} style={styles.leftIcon} /> : <></>}
            <Text style={styles.text}>{text}</Text>
          </View>
        </>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.primary,
    padding: 16,
    height: 60,
    minWidth: 330,
    borderRadius: 12,
    marginBottom: 10,
  },
  text: {
    color: Color.white,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: 10,
  },
});
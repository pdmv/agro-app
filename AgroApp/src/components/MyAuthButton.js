import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Color from "../themes/Color";

export default MyAuthButton = ({ text, onPress, status, error }) => {
  return (
    
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
      {status === 'loading' ? <ActivityIndicator /> : <Text style={styles.text}>{text}</Text>}
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
    color: Color.whiteBackground,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  }
});
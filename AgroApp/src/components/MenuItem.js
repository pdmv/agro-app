import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import Color from "../themes/Color";

const MenuItem = ({ icon, text, handlePress }) => {
  return (
    <TouchableOpacity style={styles.menuWrapper} onPress={handlePress}>
      <Feather name={icon} size={24} style={styles.menuIcon} />
      <Text style={styles.menuText}>{text}</Text>
    </TouchableOpacity>
  );
};

export default MenuItem;

const styles = StyleSheet.create({
  menuWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  menuIcon: {
    color: Color.black,
    marginBottom: 8,
  },
  menuText: {
    fontSize: 12,
    color: Color.black,
  },
});
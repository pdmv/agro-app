import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Color from "../themes/Color";

const appIcon = require('../../assets/Images/app_icon.png');

const UserBox = ({ image, role, lastname, firstname, username, onPress }) => {
  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress}>
      <View style={styles.imageWrapper}>
        {image !== null ? <>
          <Image source={{ uri: image }} style={styles.image} />
        </> :
          <Image source={appIcon} style={styles.image} />}
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{role}</Text>
        </View>
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.name}>{lastname} {firstname}</Text>
        <Text style={styles.username}>@{username}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default UserBox;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: Color.gray,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 12,
  },
  imageWrapper: {
    backgroundColor: Color.white,
    width: 68,
    height: 68,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Color.primary,
    marginBottom: 5,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  roleBadge: {
    position: 'absolute',
    bottom: -7,
    backgroundColor: Color.primary,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 100,
  },
  roleText: {
    color: Color.white,
    fontWeight: 'bold',
    fontSize: 9,
  },
  textWrapper: {
    marginLeft: 10,
  },
  name: {
    fontSize: 19,
    fontWeight: 'bold',
    color: Color.primary,
    marginBottom: 8,
  },
  username: {
    fontSize: 14,
    color: Color.darkestGray,
  },
});
import { StyleSheet, View, FlatList, Text } from "react-native";
import Color from "../../themes/Color";
import UserBox from "../../components/UserBox";
import { useNavigation } from "@react-navigation/native";

const ListUserScreen = ({ users }) => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <UserBox
      image={item.account.avatarUrl}
      role={item.account.role}
      lastname={item.lastname}
      firstname={item.firstname}
      username={item.account.username}
      onPress={() => handlePress({ userId: item.id })}
    />
  );

  const handlePress = ({ userId }) => {
    console.log(userId);
    navigation.navigate('UserDetail', { userId: userId });
  }

  const isUsersEmpty = !users || users.length === 0;

  return (
    <View style={styles.container}>
      {isUsersEmpty ? (
        <>
          {/* <Text style={styles.emptyMessage}>Không có dữ liệu.</Text> */}
        </>
      ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => {
              if (item.id) {
                return item.id.toString();
              } else {
                return 'default-key';
              }
            }}
            renderItem={renderItem}
          />
      )}
    </View>
  );
};

export default ListUserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  emptyMessage: {
    fontSize: 16,
    color: Color.darkestGray,
    textAlign: 'center',
    marginTop: 20,
  },
});
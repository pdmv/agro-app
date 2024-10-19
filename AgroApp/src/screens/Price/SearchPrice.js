import { Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import SearchBar from "../../components/SearchBar";
import ErrorModal from "../../common/ErrorModal";
import { useState, useEffect } from "react";
import API, { authApi, endpoints } from "../../services/api";
import { useDispatch, useSelector } from "react-redux";
import FunctionNav from "../../components/FunctionNav";
import Color from "../../themes/Color";
import { useNavigation } from "@react-navigation/native";
import FilterOptions from "../../components/FilterOptions";
import ProductContainer from "../../components/ProductContainer";
import { addToCart } from "../../redux/cartSlice";

const SearchPrice = () => {
  const navigation = useNavigation();
  const { token, user } = useSelector((state) => state.auth);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();

  const [list, setList] = useState([]);

  const handleOk = () => {
    setShowErrorModal(false);
    setError(null);
  }

  const handleSearch = async () => {
    try {
      const response = await API().get(`${endpoints["list-price"]}?itemName=${searchText}`);
      setList(response.data.result);
    } catch (error) {
      setError({ message: error.response.data.message, code: error.response.data.code });
      setShowErrorModal(true);
    }
  }

  useEffect(() => {
    if (searchText.trim() !== '') {
      const timeoutId = setTimeout(() => {
        handleSearch();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchText]);

  const handleDetail = ({ item }) => {
    navigation.navigate("PriceDetail", {
      productId: item.product.id
    });
  }

  const handleAddToCart = ({ item }) => {
    const product = {
      id: item.id,
      name: item.itemName,
      price: parseFloat(item.price),
      image: item.productPrimaryImage,
    };
    dispatch(addToCart(product));
  };

  const handleBuy = ({ item }) => {
    handleAddToCart({ item });
    navigation.navigate("OrderScreen");
  }

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <SearchBar
            placeholder="Tìm kiếm"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
          />

          <ScrollView
            contentContainerStyle={user && user.account.role !== "CUSTOMER" ?
              [{ marginTop: 20, paddingHorizontal: 16 }] :
              styles.productList}
          >
            {list && list.map((item) => {
              return (
                <>
                  <View key={item.id}>
                    {user !== null && user !== undefined && user?.account.role !== "CUSTOMER" && (
                      <FunctionNav
                        title={item.itemName}
                        leftIcon="dollar-sign"
                        rightIcon="chevron-right"
                        onPress={() => handleDetail({ item })}
                      />
                    )}

                    {(user === null || user === undefined || user?.account.role === "CUSTOMER") && (
                      <ProductContainer
                        name={item.itemName}
                        price={item.price.toFixed(0)}
                        image={{ uri: item.productPrimaryImage }}
                        handleAddToCart={() => handleAddToCart({ item })}
                        handleBuy={() => handleBuy({ item })}
                      />
                    )}
                  </View>
                </>
              );
            })}
          </ScrollView>

        </View>
      </TouchableWithoutFeedback>

      {/* Error Modal */}
      {error && showErrorModal && (
        <ErrorModal
          errorCode={error.code}
          msg={error.message}
          visible={showErrorModal}
          onPress={handleOk}
        />
      )}
    </>
  );
};

export default SearchPrice;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
});
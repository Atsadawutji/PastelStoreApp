import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage'

import constants from 'expo-constants'

import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import FavoriteModel from '../models/FavoriteModel'
import CartModel from '../models/CartModel'

const favorite_model = new FavoriteModel
const cart_model = new CartModel

const HEIGHT_DEFAULT = 768;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const ProductView = ({ route, navigation }) => {
  let { item } = route.params
  const [users, setUsers] = useState([]);
  const [product_color, setProductColor] = useState('');
  const [order_qty, setOrderQty] = useState(1);
  const [product_size, setProductSize] = useState('');
  const [cart, setCarts] = useState([]);
  const [favorite, setFavorite] = useState(
    item.favorite ? item.favorite : false
  );

  async function _getUser() {
    const user_str = await AsyncStorage.getItem('@user')
    const user = JSON.parse(user_str)
    setUsers(user)
  }

  async function _insertCart() {

    if (product_size == '') {
      Alert.alert("กรุณาเลือกขนาดของรองเท้า");
    } else if (product_color == '') {
      Alert.alert("กรุณาเลือกขนาดของรองเท้า");
    } else {
      let data = {
        product_code: item.id,
        user_code: users.user_code,
        product_color: product_color,
        product_size: product_size,
        order_qty: order_qty,
      }

      let result = await cart_model.insertCart(data);
      if (result) {
        Alert.alert('เพิ่มสินค้าลงในตะกร้าเรียบร้อย');
        navigation.navigate('MainTabs', {
          screen: 'Cart',
          params: {},
        });
      } else {
        Alert.alert('ไม่สามารถเพิ่มสินค้าได้');
      }

    }
  }

  const _decreaseOrderQty = () => {
    if (order_qty > 1) {
      setOrderQty(order_qty - 1)
    }
  }

  const _increaseOrderQty = () => {
    if (order_qty < item.stock) {
      setOrderQty(order_qty + 1)
    }
  }

  const _updateOrderQty = (text) => {
    let qty = parseInt(text);
    let stock = parseInt(item.stock);
    qty = isNaN(qty) ? 1 : qty
    qty = qty == 0 ? 1 : qty
    if (qty > stock) {
      setOrderQty(stock)
    } else {
      setOrderQty(qty)
    }
  }

  useEffect(() => {
    _getUser()
  }, [])


  let star_component = [];

  for (let i = 1.0; i <= 5; i++) {
    parseFloat(item.rating) - i >= 0
      ? star_component.push(
        <FontAwesome key={"product_" + item.id + "_star_" + i} name="star" size={16} color="#ffce3d" />
      )
      : -(parseFloat(item.rating) - i) < 1
        ? star_component.push(
          <FontAwesome key={"product_" + item.id + "_star_" + i} name="star-half-empty" size={16} color="#ffce3d" />
        )
        : star_component.push(
          <FontAwesome key={"product_" + item.id + "_star_" + i} name="star-o" size={16} color="#ffce3d" />
        );
  }


  const updateFavorite = async () => {
    if (favorite) {
      var result = await favorite_model.deleteFavorite({ user_code: users.user_code, id: item.id })
      setFavorite(false);
    } else {
      var result = await favorite_model.insertFavorite({ user_code: users.user_code, id: item.id })
      setFavorite(true);
    }

  }

  return (
    item == undefined ?
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}>
        <Text style={{ color: "aeaeae" }}>ไม่มีข้อมูลสินค้า</Text>
      </View>
      :
      <View
        style={{
          flex: 1,
        }}>
        <View
          style={{
            position: 'absolute',
            padding: 4,
            width: SCREEN_WIDTH,
            zIndex: 999,
            top: constants.statusBarHeight,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity style={[styles.circleIcon]}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <AntDesign name="arrowleft" size={20} color="white" />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <TouchableOpacity style={styles.circleIcon}>
              <AntDesign name="sharealt" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleIcon}>
              <AntDesign name="shoppingcart" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={{ flex: 1 }}>
          <View style={styles.card}>
            <Image
              style={{
                width: SCREEN_WIDTH,
                height: SCREEN_WIDTH,
              }}
              source={{
                uri: item.img,
              }}
            />
            <View style={{ marginHorizontal: 8 }}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 8,
                    flex: 1,
                  }}>
                  <Text numberOfLines={2} style={[styles.fontSubject, {}]}>
                    <Text
                      style={[
                        styles.fontLabel,
                        {
                          paddingHorizontal: 4,
                          backgroundColor: 'red',
                          borderRadius: 4,
                          marginRight: 8,
                        },
                      ]}>
                      สินค้าแนะนำ
                  </Text>
                    {item.name}
                  </Text>
                </View>
                <View
                  style={{
                    width: 32,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#FFD943',
                  }}>
                  <Text style={[styles.fontLabel, { color: 'white' }]}>ลด</Text>
                  <Text style={[styles.fontLabel]}>{item.percent}%</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.oldPrice}>{item.old_price}฿</Text>
                <Text style={styles.newPrice}>{item.price}฿</Text>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 16 }}>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  {star_component}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    borderRightWidth: 1,
                    borderRightColor: '#eee',
                    paddingHorizontal: 8,
                  }}>
                  <Text style={styles.fontSubject}>{item.rating}</Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: 8,
                  }}>
                  <Text style={styles.fontSubject}>
                    ขายแล้ว {item.sale_out} ชิ้น
                </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    updateFavorite();
                  }}>
                  {favorite ? (
                    <FontAwesome name="heart" size={24} color="red" />
                  ) : (
                      <FontAwesome name="heart-o" size={24} color="red" />
                    )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={[styles.card, { marginTop: 10 }]}>
            <View style={styles.cardHaeder}>
              <Text style={styles.fontHaeder}>ขนาด</Text>
            </View>
            <View style={[styles.cardBody, { flexDirection: 'row', flexWrap: "wrap" }]}>
              {item.sizes.map((item_size, index) => {
                return product_size == item_size ? (
                  <TouchableOpacity
                    key={"product_" + item.id + "_size_" + item_size}
                    style={[styles.labelSize, styles.selectSize]}
                    onPress={() => { setProductSize(item_size) }}
                  >
                    <Text>{item_size}</Text>
                  </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                      key={"product_" + item.id + "_size_" + item_size}
                      style={[styles.labelSize]}
                      onPress={() => { setProductSize(item_size) }}
                    >
                      <Text>{item_size}</Text>
                    </TouchableOpacity>
                  );
              })}
            </View>
          </View>

          <View style={[styles.card, { marginTop: 10 }]}>
            <View style={styles.cardHaeder}>
              <Text style={styles.fontHaeder}>สี</Text>
            </View>
            <View
              style={
                (styles.cardBody, { flexDirection: 'row', paddingHorizontal: 8, flexWrap: "wrap" })
              }>
              {item.colors.map((item_color, index) => {
                return item_color == product_color ? (
                  <TouchableOpacity
                    key={"product_" + item.id + "_color_" + item_color}
                    style={[
                      styles.labelColor,
                      styles.selectColor,
                      { backgroundColor: item_color },
                    ]}
                    onPress={() => { setProductColor(item_color) }}
                  ></TouchableOpacity>
                ) : (
                    <TouchableOpacity
                      key={"product_" + item.id + "_color_" + item_color}
                      style={[
                        styles.labelColor,
                        { backgroundColor: item_color },
                      ]}
                      onPress={() => { setProductColor(item_color) }}
                    ></TouchableOpacity>
                  );
              })}
            </View>
          </View>

          <View style={[styles.card, { marginTop: 10, marginBottom: 96 }]}>
            <View style={styles.cardHaeder}>
              <Text style={styles.fontHaeder}>รายละเอียด</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.fontBody}>{item.description}</Text>
            </View>
          </View>
        </ScrollView>
        <SafeAreaView
          style={{
            position: 'absolute',
            width: SCREEN_WIDTH,
            zIndex: 999,
            bottom: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: "#FFF",
          }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <TouchableOpacity
              style={{
                width: 64,
                paddingVertical: 16,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: '#ffb3ba'
              }}
              onPress={() => {
                _decreaseOrderQty()
              }}
            >
              <Text>
                -
              </Text>
            </TouchableOpacity>
            <TextInput style={{
              flex: 1,
              textAlign: "center",
              alignItems: "center",
            }}
              value={order_qty.toString()}
              onChangeText={(text) => { _updateOrderQty(text) }}

            />
            <TouchableOpacity
              style={{
                width: 64,
                paddingVertical: 16,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: '#ffb3ba'
              }}
              onPress={() => {
                _increaseOrderQty()
              }}
            >
              <Text>
                +
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "#0BA0F6",
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 16
            }}

            onPress={() => {
              _insertCart();
            }}
          >
            <Text> เพิ่มลงตะกร้า </Text>
          </TouchableOpacity>
        </SafeAreaView>

      </View>

  );
};

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    backgroundColor: 'white',
    paddingBottom: 8,
  },
  cardHaeder: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  fontHaeder: {
    fontSize: RFValue(16, HEIGHT_DEFAULT),
    fontWeight: 'bold',
  },
  cardBody: {
    paddingHorizontal: 8,
  },
  fontBody: {
    fontSize: RFValue(14, HEIGHT_DEFAULT),
    fontWeight: 'normal',
  },
  fontSubject: {
    fontSize: RFValue(16, HEIGHT_DEFAULT),
  },
  fontLabel: {
    fontSize: RFValue(12, HEIGHT_DEFAULT),
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    color: '#AEAEAE',
  },
  newPrice: { color: '#ee4d2d', marginLeft: 8 },
  circleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelColor: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 4,
  },
  selectColor: {
    borderColor: '#ee4d2d',
    borderWidth: 1,
  },
  labelSize: {
    padding: 16,
    borderRadius: 4,
    marginRight: 4,
    backgroundColor: '#f8f8f8',
  },
  selectSize: {
    borderColor: '#ee4d2d',
    borderWidth: 1,
  },
});

export default ProductView;

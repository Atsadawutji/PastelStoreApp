import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator
} from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize';
import ProductItem from "./ProductItem";
import CartModel from '../models/CartModel'
import AsyncStorage from '@react-native-async-storage/async-storage'

const cart_model = new CartModel

const HEIGHT_DEFAULT = 768;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const Cart = (props) => {
    const [carts, setCarts] = useState([])
    const [order_total, setOrderTotal] = useState([])
    const [users, setUsers] = useState([])

    let { navigation } = props;

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            _getUser();
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        _getUser();
    }, [])

    useEffect(() => {
        _getCart();
    }, [users])

    const _deleteCart = async (item) => {
        let result = await cart_model.deleteCart({ product_code: item.id, user_code: users.user_code });
        if (result) {
            _getCart();
            Alert.alert("ลบรายการสินค้าเรียบร้อย");
        }
    }

    async function _getUser() {
        const user_str = await AsyncStorage.getItem('@user')
        const user = JSON.parse(user_str)
        setUsers(user)
    }

    const _getCart = async () => {
        let cart_data = await cart_model.getProductByUserCode({ user_code: users.user_code });

        let total = 0;
        cart_data.forEach(item => total += parseFloat(item.order_qty) * parseFloat(item.price));
        setCarts(cart_data);
        setOrderTotal(total);
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

    return (carts.length > 0 ?
        <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
                <View style={[styles.card, { marginTop: 10, marginBottom: 96 }]}>
                    <View style={styles.cardHaeder}>
                        <Text style={styles.fontHaeder}>รายการสินค้า</Text>
                    </View>
                    <View style={styles.cardBody}>
                        {
                            carts.map((item, index) => (
                                <View key={"cart_product_" + item.id} style={{ marginBottom: 16 }}>
                                    <ProductItem
                                        navigation={navigation}
                                        key={'product_' + item.id}
                                        index={index}
                                        item={item}
                                        user_data={users}
                                        favorite={item.favorite}
                                        onFavorite={(favorite) => _setFavorite(index, favorite)}
                                    />
                                    <View style={{ flexDirection: "row" }}>

                                        <View style={{ flex: 1, flexDirection: "row", marginRight: 4 }}>

                                            <View style={{
                                                flex: 1,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                textVerticalAlign: "center"
                                            }}>
                                                <Text
                                                    style={{ fontSize: 16 }}
                                                >
                                                    จำนวน {item.order_qty.toString()} คู่
                                                </Text>
                                            </View>

                                        </View>
                                        <TouchableOpacity
                                            style={{
                                                flex: 1,
                                                backgroundColor: "#F00",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                paddingVertical: 16, marginLeft: 4
                                            }}

                                            onPress={() => {
                                                _deleteCart(item);
                                            }}
                                        >
                                            <Text> ยกเลิกรายการ </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))
                        }

                        <View style={{ borderTopColor: "#AEAEAE", borderTopWidth: 1, flexDirection: "row", marginBottom: 16, paddingVertical: 16 }}>
                            <Text style={{ fontSize: 16, flex: 1 }}>ราคารวม </Text>
                            <Text style={{ fontSize: 16 }}> {order_total} บาท </Text>

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
                                props.navigation.navigate('ConfirmAddress', {})
                            }}
                        >
                            <Text>สั่งซื้อ</Text>
                        </TouchableOpacity>
                    </View>


                </View>
            </ScrollView>
        </View>
        :
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <ActivityIndicator />
        </View>
    )

}


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
});

export default Cart;
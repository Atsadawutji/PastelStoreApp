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
import { FontAwesome, Entypo } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import Omise from 'omise-react-native';

Omise.config('pkey_test_5icnhyqgrqqp5ndihqf', '2019-05-29');

const cart_model = new CartModel
const HEIGHT_DEFAULT = 768;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function Payment(props) {

    const [carts, setCarts] = useState([])
    const [order_total, setOrderTotal] = useState([])
    const [users, setUsers] = useState([])
    const [my_address, setMyAddress] = useState("")


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

    useEffect(() => {
        let address = props.route.params.my_address
        setMyAddress(address);
    }, [carts])

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
    const _confirmPayment = async () => {
        props.navigation.navigate('PaymentConfirm', { address_location: props.route.params.address_location, my_address: my_address })
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
                                                alignItems: "flex-end",
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
                                    </View>
                                </View>
                            ))
                        }

                        <View style={{ borderTopColor: "#AEAEAE", borderTopWidth: 1, flexDirection: "row", marginBottom: 16, paddingVertical: 16 }}>
                            <Text style={{ fontSize: 16, flex: 1 }}>ราคารวม </Text>
                            <Text style={{ fontSize: 16 }}> {order_total} บาท </Text>

                        </View>
                        <View style={{ borderTopColor: "#AEAEAE", borderTopWidth: 1, flexDirection: "row", marginBottom: 5, paddingVertical: 16 }}>
                            <Entypo key={"pin"} name="location-pin" size={18} color="#ee4d2d" />
                            <Text style={styles.fontHaeder}>ที่อยู่การจัดส่ง</Text>
                        </View>
                        <View style={styles.cardBody}>
                            <Text style={{ fontSize: 16, marginRight: 15, marginLeft: 15, marginBottom: 15 }}>{my_address}</Text>
                        </View>
       

                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: "#0BA0F6",
                                justifyContent: "center",
                                alignItems: "center",
                                paddingVertical: 16
                            }}

                            onPress={() => _confirmPayment()}
                        >
                            <Text>ชำระเงิน</Text>
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
    mapContainer: {
        marginVertical: 8,
        flex: 1,
        width: SCREEN_WIDTH - 25,
    },
});

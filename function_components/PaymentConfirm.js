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
import PaymentModel from '../models/PaymentModel'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { FontAwesome, Entypo } from '@expo/vector-icons';
import Omise from 'omise-react-native';
Omise.config('pkey_test_5icnhyqgrqqp5ndihqf', '2019-05-29');
const cart_model = new CartModel
const payment_model = new PaymentModel

const HEIGHT_DEFAULT = 768;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const Payment = (props) => {
    const [carts, setCarts] = useState([])
    const [order_total, setOrderTotal] = useState([])
    const [users, setUsers] = useState([])
    const [my_address, setMyAddress] = useState("")
    const [carad_number, setCaradNumber] = useState("")
    const [name_on_card, setNameOnCard] = useState("")
    const [expiration_month, setMyExpiryMonth] = useState("")
    const [expiration_year, setMyExpiryYear] = useState("")
    const [security_code, setSecurityCode] = useState("")
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

        let obj = {}
        obj.carad_number = carad_number
        obj.name_on_card = name_on_card
        obj.expiration_month = expiration_month
        obj.expiration_year = expiration_year
        obj.security_code = security_code
        obj.user_code = users.user_code
        obj.carts = carts
        obj.amount_total = order_total
        obj.address = props.route.params.my_address
        obj.address_lat = props.route.params.address_location.latitude
        obj.address_lon = props.route.params.address_location.longitude

        /*
                     " Default card Test Omise":
                     {
                        "expiration_month": 2,
                        "expiration_year": 2022,
                        "name": "Somchai Prasert",
                        "number": "4242424242424242",
                        "security_code": "123",
                    }
        */

        try {
            const data = await Omise.createToken({
                "card":
                {
                    "expiration_month": parseInt(expiration_month),
                    "expiration_year": parseInt(expiration_year),
                    "name": name_on_card,
                    "number": carad_number,
                    "security_code": security_code,
                }
            });
            obj.token = data.id

            let payment = await payment_model.insertPaymentBy(obj)

            if (payment.status == "successful") {
                Alert.alert("การชำระเงินสำเร็จ")
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'MainNavigator' }],
                });
            } else {

                Alert.alert("การชำระเงินไม่สำเร็จ")
            }

        } catch (err) {
            Alert.alert("ข้อมูลบัตรไม่ถูกต้อง")
            console.log("data", err);
        }
    }


    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
                <View style={[styles.card, { marginTop: 10, marginBottom: 96 }]}>
                    <View style={styles.cardBody}>
                        {/* <Text style={{ fontSize: 16, flex: 1 }}>PaymentConfirm</Text> */}
                        <View style={styles.cardItem}>
                            <Text style={{ fontSize: 14, flex: 1 }}>Carad Number</Text>
                            <TextInput style={{
                                flex: 1,
                                borderColor: "#eaeaea",
                                borderWidth: 1,
                                borderRadius: 4,
                                height: 45,
                                marginTop: 4,
                                paddingHorizontal: 8,
                                width: SCREEN_WIDTH * 0.8
                            }}
                                onChangeText={(text) => setCaradNumber(text)}
                                value={carad_number}
                            // placeholder="Longitude"
                            />
                        </View>
                        <View style={styles.cardItem}>
                            <Text style={{ fontSize: 14, flex: 1 }}>Name on Card</Text>
                            <TextInput style={{
                                flex: 1,
                                borderColor: "#eaeaea",
                                borderWidth: 1,
                                borderRadius: 4,
                                height: 45,
                                marginTop: 4,
                                paddingHorizontal: 8,
                                width: SCREEN_WIDTH * 0.8
                            }}
                                onChangeText={(text) => setNameOnCard(text)}
                                value={name_on_card}
                            // placeholder="Longitude"
                            />
                        </View>
                        <View style={styles.cardItem}>
                            <View style={{ flex: 1, flexDirection: "row" }}>
                                <View style={{ flex: 1, paddingRight: 10 }}>
                                    <Text style={{ fontSize: 14, flex: 1 }}>Expiry date</Text>
                                    <TextInput style={{
                                        flex: 1,
                                        borderColor: "#eaeaea",
                                        borderWidth: 1,
                                        borderRadius: 4,
                                        height: 45,
                                        marginTop: 4,
                                        paddingHorizontal: 8,
                                    }}
                                        onChangeText={(text) => setMyExpiryMonth(text)}
                                        value={expiration_month}
                                    // placeholder="Longitude"
                                    />
                                </View>
                                <View style={{ flex: 1, paddingRight: 10 }}>
                                    <Text style={{ fontSize: 14, flex: 1 }}></Text>
                                    <TextInput style={{
                                        flex: 1,
                                        borderColor: "#eaeaea",
                                        borderWidth: 1,
                                        borderRadius: 4,
                                        height: 45,
                                        marginTop: 4,
                                        paddingHorizontal: 8,
                                    }}
                                        onChangeText={(text) => setMyExpiryYear(text)}
                                        value={expiration_year}
                                    // placeholder="Longitude"
                                    />
                                </View>
                                <View style={{ flex: 1, paddingRight: 10 }}>
                                    <Text style={{ fontSize: 14, flex: 1 }}>Security code</Text>
                                    <TextInput style={{
                                        flex: 1,
                                        borderColor: "#eaeaea",
                                        borderWidth: 1,
                                        borderRadius: 4,
                                        height: 45,
                                        marginTop: 4,
                                        paddingHorizontal: 8,
                                    }}
                                        onChangeText={(text) => setSecurityCode(text)}
                                        value={security_code}
                                    // placeholder="Longitude"
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={{ padding: 20 }}>
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
                    </View >
                </View>
            </ScrollView>
        </View >
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
        padding: 10,
    },
    cardItem: {
        // justifyContent: "center",
        alignItems: "flex-start",
        flex: 1,
        padding: 20
    },
    fontBody: {
        fontSize: RFValue(14, HEIGHT_DEFAULT),
        fontWeight: 'normal',
    },
});

export default Payment;
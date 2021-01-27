import React, { useState, useEffect } from 'react'

import { View, Image, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import UserModel from '../models/UserModel'

const user_model = new UserModel
const styles = StyleSheet.create({
    inputs: {
        backgroundColor: "#0BA0F6",
        height: 32,
        borderRadius: 8,
        marginTop: 8,
        paddingHorizontal: 16,
        minWidth: 240
    },
    loginButton: {
        backgroundColor: "#ffb3ba",
        height: 32,
        borderRadius: 8,
        marginTop: 8,
        paddingHorizontal: 16,
        minWidth: 240,
        justifyContent: "center",
        textAlign: "center"
    },
    textWhiteNormal: {
        alignSelf: "center",
        fontSize: 16,
        color: "#FFF"
    },
    logoPastel: {
        color: "#0BA0F6",
        fontWeight: "bold",
        fontSize: 48
    },
    logoStore: {
        color: "#ffb3ba",
        fontWeight: "normal",
        fontSize: 48

    }
})

const Login = ({ navigation }) => {

    const [user_username, setUserName] = useState("")
    const [user_password, setPassword] = useState("")

    const _checkLogin = async () => {

        if (user_username == '') {
            Alert.alert("กรุณากรอก Username");
        } else if (user_password == '') {
            Alert.alert("กรุณากรอก Password");
        } else {
            let login_result = await user_model.getUserLogin({ user_username, user_password });

            if (login_result == []) {
                Alert.alert("ไม่สามารถเข้าใช้งานได้เนื่อง Username หรือ Password ไม่ถูกต้อง")
            } else {
                AsyncStorage.setItem('@user', JSON.stringify(login_result[0])).then(() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'MainNavigator' }],
                    });
                })

            }
        }

    }

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor:"#FFF" }}>
            <View>
                <View style={{ flexDirection: "row", marginBottom: 32 }}>

                    <Text
                        style={styles.logoPastel}
                    >Pastel</Text>
                    <Text
                        style={styles.logoStore}
                    >Store</Text>
                </View>
                <TextInput style={styles.inputs}
                    placeholder="Username"
                    placeholderTextColor="#FFF"
                    keyboardType="email-address"
                    underlineColorAndroid='transparent'
                    autoCapitalize='none'
                    value={user_username}
                    onChangeText={text => setUserName(text)}
                />
                <TextInput style={styles.inputs}
                    placeholder="Password"
                    placeholderTextColor="#FFF"
                    secureTextEntry={true}
                    underlineColorAndroid='transparent'
                    autoCapitalize='none'
                    value={user_password}
                    onChangeText={text => setPassword(text)}
                />

                <TouchableOpacity
                    style={[styles.loginButton]}
                    onPress={() => { _checkLogin() }}
                >
                    <Text style={styles.textWhiteNormal}>ลงชื่อเข้าใช้</Text>
                </TouchableOpacity>

            </View>

        </View>
    )
}

export default Login;

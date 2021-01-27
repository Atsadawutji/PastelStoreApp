import React, { useEffect } from 'react'
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const styles = StyleSheet.create({
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

const Authen = ({ navigation }) => {
    useEffect(() => {
        checkPremission();
    }, [])

    const checkPremission = async () => {
        const user_str = await AsyncStorage.getItem('@user')

        if (user_str == null) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'LoginNavigator' }],
            });
        } else {
            const user = JSON.parse(user_str)
            if (user.user_code == undefined) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'LoginNavigator' }],
                });
            } else {
                navigation.reset({
                    index: 0,
                    routes: [{
                        name: 'MainNavigator',
                        params: {
                            screen: 'MainTabs',
                            params: {
                                screen: 'ProductSearch',
                                params: {},
                            },
                        }
                    }],
                });
            }
        }


    }

    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        }}>
            <View style={{ flexDirection: "row", marginBottom: 32 }}>
                <Text
                    style={styles.logoPastel}
                >Pastel</Text>
                <Text
                    style={styles.logoStore}
                >Store</Text>
            </View>

            <View style={{ flexDirection: "row", marginBottom: 32 }}>

                <Text style={{
                    color: "#AEAEAE",
                    fontSize: 12,
                    paddingHorizontal: 16
                }}>กำลังตรวจสอบสิทธิ์</Text>
                <ActivityIndicator />
            </View>
        </View>
    )
}

export default Authen;

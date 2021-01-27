import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    TextInput
} from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize';
import MapView, { Marker } from 'react-native-maps';


const HEIGHT_DEFAULT = 768;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function ConfirmAddress(props) {
    const [address_location, setAddressLocation] = useState({
        latitude: 14.979900,
        longitude: 102.097771
    })
    const [focus_location, setFocusLocation] = useState({
        latitude: 14.979900,
        longitude: 102.097771,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    })
    const [my_address, setMyAddress] = useState("")

    const _onConfirmAddress = async () => {
        props.navigation.navigate('Payment', { my_address: my_address, address_location: address_location })
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={[styles.card, { marginTop: 10, }]}>
                <View style={styles.cardHaeder}>
                    <Text style={styles.fontHaeder}>ที่อยู่ของฉัน</Text>
                </View>
                <View style={styles.cardBody}>
                    <TextInput
                        style={{
                            borderColor: "#eaeaea",
                            paddingHorizontal: 8,
                            borderWidth: 1,
                            borderRadius: 4,
                            minHeight: 120
                        }}
                        onChangeText={(text) => setMyAddress(text)}
                        value={my_address}
                        multiline={true} />
                </View>
            </View>
            <View style={[styles.card, { marginTop: 10, flex: 1 }]}>
                <View style={styles.cardHaeder}>
                    <Text style={styles.fontHaeder}>ระบุพิกัดเพิ่มเติม</Text>
                </View>
                <View style={[styles.cardBody, { flex: 1 }]}>
                    <View style={{
                        flexDirection: "row"
                    }}>
                        <TextInput
                            style={{
                                flex: 1,
                                borderColor: "#eaeaea",
                                borderWidth: 1,
                                borderRadius: 4,
                                height: 32,
                                marginRight: 4,
                                paddingHorizontal: 8
                            }}
                            value={address_location.latitude.toString()}
                            placeholder="Latitude"
                        />

                        <TextInput style={{
                            flex: 1,
                            borderColor: "#eaeaea",
                            borderWidth: 1,
                            borderRadius: 4,
                            height: 32,
                            marginLeft: 4,
                            paddingHorizontal: 8
                        }}
                            value={address_location.longitude.toString()}
                            placeholder="Longitude"
                        />

                    </View>
                    <MapView style={styles.mapContainer}
                        maximumZ={19}
                        region={focus_location}
                        onPress={(e) => {
                            setAddressLocation({
                                latitude: e.nativeEvent.coordinate.latitude,
                                longitude: e.nativeEvent.coordinate.longitude
                            });
                        }}

                        onRegionChange={(region) => {
                            setFocusLocation({
                                latitude: region.latitude,
                                longitude: region.longitude,
                                latitudeDelta: region.latitudeDelta,
                                longitudeDelta: region.longitudeDelta,
                            })
                        }}
                    >
                        <Marker coordinate={{
                            latitude: address_location.latitude,
                            longitude: address_location.longitude,
                        }} />
                    </MapView>

                </View>
                <View style={styles.cardBody2}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            backgroundColor: "#0BA0F6",
                            justifyContent: "center",
                            alignItems: "center",
                            paddingVertical: 16,
                            // height: 40

                        }}

                        onPress={() => _onConfirmAddress()}
                    >
                        <Text>ยืนยัน</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
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
        width: SCREEN_WIDTH - 16,
    },
    cardBody2: {
        paddingHorizontal: 8,
        height: 40
    },
});

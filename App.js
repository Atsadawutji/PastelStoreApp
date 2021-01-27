import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'


import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import { FontAwesome5, Octicons, AntDesign } from '@expo/vector-icons';

import MyOrder from "./function_components/MyOrder";
import Cart from "./function_components/Cart";
import ConfirmAddress from "./function_components/ConfirmAddress";
import ProductSearch from "./function_components/ProductSearch";
import ProductView from './function_components/ProductView';
import Login from './function_components/Login';
import Authen from './function_components/Authen';
import Payment from './function_components/Payment';
import PaymentConfirm from './function_components/PaymentConfirm';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="ProductSearch" component={ProductSearch} options={{
        title: 'สินค้า',
        tabBarLabel: 'สินค้า',
        tabBarIcon: ({ color }) => (
          <FontAwesome5 name="store-alt" color={color} size={Platform.OS === 'ios' ? 18 : 26} />
        ),
      }} />
      <Tab.Screen name="Cart" component={Cart} options={{
        title: 'ตะกร้าสินค้า',
        tabBarLabel: 'ตะกร้าสินค้า',
        tabBarIcon: ({ color }) => (
          <FontAwesome5 name="shopping-cart" color={color} size={Platform.OS === 'ios' ? 18 : 26} />
        ),
      }} />
      <Tab.Screen name="MyOrder" component={MyOrder} options={{
        title: 'รายการสั่งซื้อ',
        tabBarLabel: 'รายการสั่งซื้อ',
        tabBarIcon: ({ color }) => (
          <Octicons name="list-ordered" color={color} size={Platform.OS === 'ios' ? 18 : 26} />
        ),
      }} />
    </Tab.Navigator>
  );
}


const MainNavigator = (props) => {
  let { navigation } = props
  return (
    <Stack.Navigator
      headerShown={false}
      headerMode="screen"
      initialRouteName="MainTabs"
      {...props}
    >

      <Stack.Screen name="ProductView" component={ProductView} options={{
        title: 'รายละเอียดสินค้า',
        headerShown: false
      }} />

      <Stack.Screen name="ConfirmAddress" component={ConfirmAddress} options={{
        title: 'สถานที่จัดส่ง',
        headerShown: true
      }} />

      <Stack.Screen name="MainTabs" component={MainTabs} options={{
        title: 'Pastel Store',
        headerRight: () => (
          <TouchableOpacity style={{
            paddingHorizontal: 16
          }}
            onPress={() => {
              AsyncStorage.setItem('@user', JSON.stringify([])).then(() => {
                navigation.navigate("LoginNavigator");
              });
            }}
          >
            <AntDesign name="poweroff" size={Platform.OS === 'ios' ? 18 : 26} color="black" />
          </TouchableOpacity>
        ),

      }} />

      <Stack.Screen name="Payment" component={Payment} options={{
        title: 'ชำระเงิน',
        headerShown: true
      }} />
      <Stack.Screen name="PaymentConfirm" component={PaymentConfirm} options={{
        title: 'ชำระเงิน',
        headerShown: true
      }} />

    </Stack.Navigator>
  )
}


export const LoginNavigator = (props) => (
  <Stack.Navigator {...props} headerMode='none'>
    <Stack.Screen name='Login' component={Login} />
  </Stack.Navigator>
);


export const AuthNavigator = (props) => (
  <Stack.Navigator {...props} headerMode='none'>
    <Stack.Screen name='Authen' component={Authen} />
  </Stack.Navigator>
);

export const AppNavigator = (props) => (
  <Stack.Navigator
    {...props}
    headerMode="none"
    initialRouteName="AuthNavigator" >
    <Stack.Screen name='AuthNavigator' component={AuthNavigator} />
    <Stack.Screen name='LoginNavigator' component={LoginNavigator} />
    <Stack.Screen name='MainNavigator' component={MainNavigator} />
  </Stack.Navigator>
);


export default function App() {

  const navigationRef = React.useRef(null);

  return (
    <NavigationContainer ref={navigationRef} >
      <AppNavigator />
    </NavigationContainer>
  );
}

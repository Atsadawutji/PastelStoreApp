import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import ProductItem from './ProductItem';
import AsyncStorage from '@react-native-async-storage/async-storage'


import ProductModel from '../models/ProductModel'

const product_model = new ProductModel();

const ProductSearch = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  async function _getUser() {
    const user_str = await AsyncStorage.getItem('@user')
    const user = JSON.parse(user_str)
    setUsers(user)
  }

  async function _fetchData() {
    let product_data = await product_model.getProductBy({ user_code: users.user_code, keyword: '' }) 
    setProducts(product_data);
  }

  useEffect(() => {
    _getUser();
  }, []);

  useEffect(() => {
    if (users.user_code) {
      _fetchData()
    }
  }, [users]);

  const _setFavorite = (index, favorite) => {
    let datas = products;
    datas[index].favorite = favorite;
    setProducts(datas);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#EFEFEF',
      }}>
      {products.length > 0 ?
        <ScrollView>
          {products.map((item, index) => {
            return (
              <ProductItem
                navigation={navigation}
                key={'product_' + item.id}
                index={index}
                item={item}
                user_data={users}
                favorite={item.favorite}
                onFavorite={(favorite) => _setFavorite(index, favorite)}
              />
            );
          })}
        </ScrollView>
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
      }
    </View>
  );
};

export default ProductSearch;

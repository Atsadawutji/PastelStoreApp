import React, { useState } from 'react';
import FavoriteModel from '../models/FavoriteModel'

const favorite_model = new FavoriteModel

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const ProductItem = (props) => {
  const { item = [], user_data, index, onFavorite } = props;
  const [favorite, setFavorite] = useState(
    item.favorite ? item.favorite : false
  );
  const [users, setUsers] = useState(user_data);

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
      onFavorite(false);
    } else {
      var result = await favorite_model.insertFavorite({ user_code: users.user_code, id: item.id })
      setFavorite(true);
      onFavorite(true);
    }

  }

  return (
    <View
      style={{
        margin: 4,
        flexDirection: 'row',
        backgroundColor: '#FFF',
        height: 64,
      }}>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('ProductView', { item: item })
        }}
      >
        <Image
          style={{ width: 64, height: 64 }}
          source={{
            uri: item.img,
          }}
        />
      </TouchableOpacity>

      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          backgroundColor: '#FFF',
          padding: 8,
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              backgroundColor: '#FFF',
            }}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('ProductView', { item: item })
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 12,
                }}>
                {item.name}
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                color: '#666',
                fontSize: 8,
              }}
              numberOfLines={1}
              ellipsizeMode="middle">
              {item.description}
            </Text>
          </View>
          <View
            style={{
              height: 32,
              width: 32,
              flexDirection: 'column',
            }}>
            <TouchableOpacity
              onPress={() => {
                updateFavorite()
              }}>
              {favorite ? (
                <FontAwesome name="heart" size={24} color="red" />
              ) : (
                  <FontAwesome name="heart-o" size={24} color="red" />
                )}
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text style={{
            textDecorationLine: 'line-through',
            color: '#AEAEAE',
          }}>{item.old_price}฿</Text>
          <Text style={{
            color: '#ee4d2d',
            marginLeft: 8
          }}>{item.price}฿</Text>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            {star_component}
            <Text
              style={{
                width: 32,
              }}>
              {' '}
              {item.rating}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
export default ProductItem;

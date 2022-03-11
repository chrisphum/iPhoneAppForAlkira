import "react-native-gesture-handler";
// import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
// import { launchCamera } from "react-native-image-picker";
import {
  // SafeAreaView,
  ScrollView,
  Image,
  Button,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import MapView, {
  // AnimatedRegion,
  // Animated,
  Polygon,
  Polyline,
} from "react-native-maps";
import React, { useEffect, useState, useRef } from "react";
import * as Location from "expo-location";
import { Loop } from "./Fetch.js";
import { useDataLayerValue } from "./DataLayer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ViewShot, { captureRef } from "react-native-view-shot";
import shorthash from "shorthash";
// import { FileSystem } from 'expo';
import * as FileSystem from "expo-file-system";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import MapScreen from "./MapScreen.js";
import { useContext } from "react/cjs/react.production.min";
import react from "react";
import { FlatList } from "react-native-gesture-handler";
import {newRoute, saveRoute, getRouteFunc} from "./LoadingAndSaving.js";


const Drawer = createDrawerNavigator();
const styles = StyleSheet.create({
  drawer: {
    height: '100%',
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgb(229,229,234)',
  },
  cell: {
    width: '100%',
    aspectRatio: 1,
    alignItems: "center",

    borderRadius:1000,
    overflow: 'hidden',
    borderColor: "rgb(48, 209, 88)",
    borderWidth: 7
  }
});

export default function Controller() {

const [{ userLatitude, userLongitude, viewRegion, viewRoute, routesList},dispatch] = useDataLayerValue();

function CustomDrawerContent() {
    return (
      <ScrollView  style={styles.drawer}>
          {routesList.slice(0).reverse().map((img, i) =>
          <View style={styles.cell}>
          <TouchableOpacity onPress={() => getRouteFunc(routesList[ routesList.length - 1 - i], dispatch)}>
          <Image source={{uri: "data:image/png;base64,"+img["imageBase64"]}} key={i} style={{width: '100%', aspectRatio: 0.5}}/>
          </TouchableOpacity></View>)}
      </ScrollView>
      );}

useEffect(() => {

  (async () => {
      try{
          // AsyncStorage.clear();
          const keys = await AsyncStorage.getAllKeys();
          let x = []
          for (let i = 0; i < keys.length; i++) {
            x.push(  JSON.parse(  await AsyncStorage.getItem(keys[i])
          ))}
          dispatch({
            type: "SAVE_MULTIPLE_ROUTES",
            route: x})
      } catch (error) {}
  })();

  (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      dispatch({
        type: "SET_NO_ROUTE_VIEW",
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
    });
  })();
}, []);



return (
  <NavigationContainer>
    <Drawer.Navigator initialRouteName="Drawer" drawerContent={CustomDrawerContent}>
      <Drawer.Screen name="Home" component={MapScreen} options={{headerShown: false}} />
    </Drawer.Navigator>
  </NavigationContainer>
);
}
import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Share } from "react-native";
import { launchCamera } from "react-native-image-picker";
import {
  SafeAreaView,
  ScrollView,
  Image,
  Button,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import MapView, {
  AnimatedRegion,
  Animated,
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
import { Routes } from "./Controller.js";
import { useContext } from "react"


export function loadRoute(route, dispatch) {
    let result = route;
    let polyCoords = result.polyCoords;
    let distance = parseInt((result.finalDistance * 10) / 1609) / 10;
    let wayPoints = result.waypoints;
    let latitudeDelta = result.latDelta;
    let longitudeDelta = result.lonDelta;
    let centerlat = result.centerLat;
    let centerlong = result.centerLon;
    dispatch({
        type: "SET_NEW_ROUTE_VIEW",
        polyCoords: polyCoords,
        wayPoints: wayPoints,
        distance: distance,
        latitudeDelta: latitudeDelta,
        longitudeDelta: longitudeDelta,
        centerLat: centerlat,
        centerLong: centerlong,
        currentRoute: result,
    });
}

export async function newRoute(userLatitude, userLongitude, dispatch, distance) {

    let result = await Loop(userLatitude, userLongitude, distance);
    loadRoute(result, dispatch);
}

export const saveRoute = async (imageBase64, currentRoute, dispatch) => {

    const image = await imageBase64
    // const hashName = image
    const hashName = shorthash.unique(JSON.stringify(currentRoute));
    const data = {route: currentRoute, imageBase64: image}

    try {
        await AsyncStorage.setItem(hashName,JSON.stringify(data));

        dispatch({
            type: "ADD_SAVED_ROUTE",
            route: data})

        } catch (error) {
            console.log("Error Saving Async Storage")
        }
    
    };

export const getRouteFunc = async (routesList, dispatch) => {

    const hashName = routesList
    console.log("GO")    
    loadRoute( routesList["route"], dispatch )
    // try {
    //     const result = await  AsyncStorage.getItem(hashName) ;
    //     const result2 = JSON.parse(result)
    
    //     if (result2 !== null) {
    //         loadRoute( result2["route"], dispatch);
    //     }

    //     } catch (error) {
    //         console.log("Error Retrieving from Async Storage")
    //     }

    
    


};

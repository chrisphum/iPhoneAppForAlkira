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
import { Link, NavigationContainer } from "@react-navigation/native";
import { Routes } from "./Controller.js";
import { useContext } from "react"
import {newRoute, saveRoute, getRouteFunc, loadRoute} from "./LoadingAndSaving.js";
import { Linking } from "react-native";
import Slider from '@react-native-community/slider';
import { reportLogBoxError } from "react-native/Libraries/LogBox/Data/LogBoxData";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { set } from "react-native-reanimated";
import Position from "react-native/Libraries/Components/Touchable/Position";
// import { getDeviceCountry} from 'react-native-device-info'

const styles = StyleSheet.create({

    container: {

      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      flexDirection: "column",
    },
    map: {
      ...StyleSheet.absoluteFillObject,

    },
    map2: {
        width: '100%',
        flexDirection: "row",
        justifyContent: "center",
        flex: 6
    },
    topleftButton: {
        width: '60%',
        height: '10%',
       alignSelf: "flex-end",
        justifyContent: "center",
       alignItems: "center",
       borderRadius: 20,
    },

    bottomDiv: {
    width: '100%',
    backgroundColor: 'rgb(229,229,234)',
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
    },
    slider: {

        flex: 3,
        margin: 20,
        
    },
    sliderRow: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",

    },
    bottomButtonsBox: {
        width: '100%',
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    bottomButtons: {
        flex: 1,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: 'center',

    },
    
  });




  export default function MapScreen({ navigation }) {

    const [distanceM, setDistanceM] = useState(1609)
    const [changeImperial, setChangeImperial] = useState("mi")
    const [division, setDivision] = useState(1609.00)

  
    useEffect(() => { 
        if (currentRoute != null) {
                setDistanceM(currentRoute["finalDistance"])
                console.log(currentRoute["finalDistance"])
        }
    }, [useDataLayerValue()]);

    const [
      { userLatitude, userLongitude, viewRegion, viewRoute, currentRoute, routesList},
      dispatch
    ] = useDataLayerValue();

    const ref = useRef();
    async function TakeMapScreenshot() {

            loadRoute( currentRoute, dispatch )
            return await ref.current.capture()
            
    };

    function openGoogleMaps(e){

        console.log("HRYY")

        if (currentRoute != null) {

            saveRoute(TakeMapScreenshot(), currentRoute, dispatch)
    
            const waypoints = currentRoute["waypoints"]
    
            var j = ""
    
            const origin = waypoints[0].latitude + "," + waypoints[0].longitude
    
            for (let i=1; i<waypoints.length-1; i++) {
                j = j + waypoints[i].latitude + "," + waypoints[i].longitude + "|"
            }
            let x = "https://www.google.com/maps/dir/?api=1" + "&waypoints=" + j + "&destination=" + origin + "&travelmode=walking"
            Linking.openURL(x)
            return null
    
        }
      }
    

    function updateDistance(e) {
        const meters = e * 1609 * 12
        setDistanceM(meters)
        return null
    }

    function changeDistanceType() {
        if(changeImperial == "mi") {
            setChangeImperial("km")
            setDivision(1000.00)
        }
        else{setChangeImperial("mi")
            setDivision(1609.00)}
    }
  
    return (
    // 
    <ViewShot ref={ref} style = {{flex: 1}} options={{format:'png',quality:0.01,result:'base64'}}>
      <View style={styles.container}>

        <View style={styles.map2}>
            

        <MapView
          style={styles.map}
          region={viewRegion}
          showsUserLocation={true}
          ref={(map) => {
            ref.map = map;
          }}
        >
          <Polyline
            coordinates={viewRoute.polyCoords}
            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
            strokeWidth={6}
          />
        </MapView>

        <TouchableOpacity title="New Route" style={{...styles.topleftButton,  ...{backgroundColor: "rgba(102, 212, 207,0.85)"}  }} onPress={() => newRoute(userLatitude, userLongitude, dispatch, distanceM)} >
            <Text style={{   fontSize: RFPercentage(3)      }}>New Route</Text></TouchableOpacity>



        </View>
        

        <View style={styles.bottomDiv}>
        <View style={styles.sliderRow}>
        <Slider
            onValueChange={(e) => updateDistance(e)}
            value={0.2}
            style={styles.slider}
            minimumValue={0.05}
            maximumValue={1}
            minimumTrackTintColor="rgb(174, 174, 178)"
            maximumTrackTintColor="rgb(242, 242, 247)"
            />


            <TouchableOpacity title="New Route" style={{...styles.bottomButtons,  ...{backgroundColor: "rgb(242, 242, 247)"}  }} onPress={() => changeDistanceType()} >
            <Text style={{   fontSize: RFPercentage(3)      }}>{parseFloat(distanceM / division).toFixed(1)} {changeImperial}</Text></TouchableOpacity>
        </View>
        <View style={styles.bottomButtonsBox}>

        <TouchableOpacity title="Open Map" style={{ ...styles.bottomButtons, ...{backgroundColor:"rgb(199, 199, 204)"}  }}  onPress={() => navigation.openDrawer()} >
        <Text style={{   fontSize: RFPercentage(3)      }}>Old Routes</Text></TouchableOpacity>
        
        <TouchableOpacity title="Open Map" style={{...styles.bottomButtons,  ...{backgroundColor:"rgb(199, 199, 204)"}  }}  onPress={() => saveRoute(TakeMapScreenshot(), currentRoute, dispatch)} >
        <Text style={{   fontSize: RFPercentage(3)      }}>Save Route</Text></TouchableOpacity>
        
        <TouchableOpacity title="Open Map" style={{...styles.bottomButtons,  ...{backgroundColor:"rgba(48, 209, 88,0.8)"}  }}  onPress={() => openGoogleMaps()} >
        <Text style={{   fontSize: RFPercentage(3)      }}>Go! <Image style= {{width: RFPercentage(3), height: RFPercentage(3)}} source={require('./assets/google.png')} /></Text></TouchableOpacity>

        {/* <Button title="Get Route" onPress={() => getRouteFunc(routesList, dispatch)} />
        <Button title="Get Route" onPress={() => openAppleMaps()} /> */}
        </View>
        </View>

      </View>
      </ViewShot>
      
      
   
  

      
    //   
          
      

    );
  }

  




     // async function takeSnapshot() {
    //   const snapshot = ref.map.takeSnapshot({
    //     width: 300, // optional, when omitted the view-width is used
    //     height: 300, // optional, when omitted the view-height is used
    //     // region: {..},    // iOS only, optional region to render
    //     format: "png", // image formats: 'png', 'jpg' (default: 'png')
    //     quality: 0.8, // image quality: 0..1 (only relevant for jpg, default: 1)
    //     result: "file", // result types: 'file', 'base64' (default: 'file')
    //   });
    //   return snapshot.then((uri) => {
    //     return uri;
    //   });
    // }
  
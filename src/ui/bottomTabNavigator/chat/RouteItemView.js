import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View
} from "react-native";

import MapView, { Polyline } from "react-native-maps";

import {addRouteItem} from '../../../query/accessFireStore'

const RouteItemView = ({ itemInfo, userInfo }) => {
  
    const saveRouteItem = () => {
 
      let routeItemObj = Object.assign({}, ...itemInfo )

      console.log('RouteItemView itemInfo', itemInfo)
      console.log('RouteItemView userInfo', userInfo)
      console.log('RouteItemView routeItem', routeItemObj)

      addRouteItem(routeItemObj, userInfo.id)
    }

    const saveRouteItemFirestore = () => {    

      // 아이템을 저장
    };

    const saveRouteItemStore = () => {

    }
 
    return (
      <TouchableOpacity
        onPress={saveRouteItem}
        style={{ backgroundColor: 'gray', width: 250, height: 250 }}>
        <MapView style={{height:250, width:250}}

          initialRegion={{
            latitude: itemInfo[0].centerInfo.latitude,
            longitude: itemInfo[0].centerInfo.longitude,
            latitudeDelta: itemInfo[0].deltaInfo.latitudeDelta * 2,
            longitudeDelta: itemInfo[0].deltaInfo.longitudeDelta * 2,
          }}
          loadingEnabled={true}
          liteMode={true}
          // setMapBoundaries={getBoundInfo(itemInfo[0])}
          >

          <Polyline
            coordinates={itemInfo[0].routeCoordinates}
            strokeWidth={5}
            strokeColor="#233ff7"
          />
        </MapView>
        <Text>asdf</Text>
        
      </TouchableOpacity>
    );
  };
  



const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default RouteItemView
import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  ToastAndroid
} from "react-native";

import MapView, { Polyline } from "react-native-maps";

import { connect } from 'react-redux'; 
import { addRecordedRoute } from '../../../actions/Actions'
import { bindActionCreators } from 'redux'; 

import {addRouteItem} from '../../../query/accessFireStore'

const RouteItemView = ({ itemInfo, userInfo, addRecordedRoute }) => {
  
    const saveRouteItem = () => {
      showToastWithGravity('아이템이 저장되었습니다.')
      let routeItemObj = Object.assign({}, ...itemInfo )
      addRouteItem(routeItemObj, userInfo.id)
      addRecordedRoute(routeItemObj)
      
    }
 
  const showToastWithGravity = (text) => {
    ToastAndroid.showWithGravity(
      text,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  };
  

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
      </TouchableOpacity>
    );
  };
   
const mapStateToProps = (state) => {
  const { userInfo } = state
  return { userInfo }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
      addRecordedRoute,
  }, dispatch)
);

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
 
export default connect(mapStateToProps, mapDispatchToProps)(RouteItemView);
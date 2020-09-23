import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import MapView, {
  Polyline,
} from "react-native-maps";

import MapViewDirections from 'react-native-maps-directions';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Marker } from 'react-native-svg';

class GraphTap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      newRecord: {},
      recordedCourse: [
        { id: 0, latlng: [] },
      ],
    };

  }

  goToGraphDetail = () => {
    alert('GraphScreen 필요')
  }

  getMapCamera = () => ({
    center: {
      latitude: 37.590920,
      longitude: 126.913571,
    },
    pitch: 3,
    heading: 0,
    zoom: 13,
    //todo : 루트의 크기나 방향에 맞춰서 줌 배율을 달리해야함.
    /** 단위????
     * 20 : 1128.497220 
19 : 2256.994440
18 : 4513.988880
17 : 9027.977761
16 : 18055.955520
15 : 36111.911040
14 : 72223.822090
13 : 144447.644200
12 : 288895.288400
11 : 577790.576700
10 : 1155581.153000
9  : 2311162.307000
8  : 4622324.614000
7  : 9244649.227000
6  : 18489298.450000
5  : 36978596.910000
4  : 73957193.820000
3  : 147914387.600000
2  : 295828775.300000
1  : 591657550.500000
     */
  });

  getMapCamera = item => ({
    center: {
      latitude: item.routeCoordinates[0].latitude,
      longitude: item.routeCoordinates[0].longitude
    },
    pitch: 3,
    heading: 0,
    zoom: 16,
  });

  getBoundInfo = item => ({
    northEast: item.boundInfo.northEast,
    southWest: item.boundInfo.southWest,
  })

  getStartPoint = item => ({

  })

  renderItem = ({ item }) => {
    return (

      <TouchableOpacity >
        <View style={styles.row}>
          <View style={styles.container}>
            {
              console.log('델타값 '),
              console.log(item.deltaInfo.latitudeDelta),
              console.log(item.deltaInfo.longitudeDelta)
            }
            <MapView style={styles.map}
              initialRegion={{

                
                latitude: item.centerInfo.latitude,
                longitude: item.centerInfo.longitude,
                
                /**
                 * 델타값에 2를 곱해주는 이유:
                 * -
                 */
                latitudeDelta: item.deltaInfo.latitudeDelta*2,
                longitudeDelta: item.deltaInfo.longitudeDelta*2,
              }}
              loadingEnabled={true}
              liteMode={false}
              setMapBoundaries={this.getBoundInfo(item)}
              // camera={this.getMapCamera(item)}
            >
              {/* <MapViewDirections 
                   origin={origin}
                   destination={destination}
                   apikey={GOOGLE_MAPS_APIKEY}
                /> */}

              {/* <Marker
                coordinate={}
                title='title'
                description='des'
              /> */}

              <Polyline coordinates={item.routeCoordinates} strokeWidth={6} strokeColor="#fc3d03" />
            </MapView>

          </View>
          <View>
            <View style={styles.nameContainer}>
              <Text>거리 : {item.distance}m</Text>
              <Text>시간 : {} 분</Text>
              <Text>평균속도 : {} km/h</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }} >
        {console.log('this.props.routeInfo.routeItem')}
        {console.log(this.props.userInfo)}
        <FlatList
          data={this.props.userInfo.routeItem}
          keyExtractor={item => {
            return item.id;
          }}
          renderItem={this.renderItem} />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { userInfo } = state
  return { userInfo }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    // 수정 및 삭제 액션 추가햐야 함.
  }, dispatch)
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    backgroundColor: '#dbdbca',
    borderColor: 'white',
  },
  nameContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: 280,
  },
  container: {
    width: 275,
    height: 150,
    padding: 10,
    margin: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(GraphTap);

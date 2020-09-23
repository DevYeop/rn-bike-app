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
  Marker,
} from "react-native-maps";
 
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 

import {GOOGLE_MAPS_APIKEY} from '../../actions/types'

class GraphDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      newRecord: {},
      recordedCourse: [
        { id: 0, latlng: [] },
      ],
    };

  }

  goToGraphDetail = (item) => {

    this.props.navigation.navigate('GraphDetail',{
      routeInfo : item,
      /**
       * 디테일 화면에 넘겨줄 정보들 여다가 ㅇㅇ
       */
    // itemId: 86,
    // otherParam: 'anything you want here',
    })
    
  }


  getBoundInfo = item => ({
    northEast: item.boundInfo.northEast,
    southWest: item.boundInfo.southWest,
  })

  getStartPoint = item => ({

  })

  getLapTime(item) {
    
    let lapTimeString;

    console.log("랩ㅌ임")
    console.log(item)

    if(item.sec != 0){
      
    }

    if(item.hour == 0){
      console.log("0시간")
    }else{
      lapTimeString = item.hour+'시 '
    }
    if(item.min == 0){
      console.log("0분")
    }else{
      lapTimeString = item.min+'분 '
    }

    if(item.sec == 0){
      console.log("0초")
    }else{
      lapTimeString = item.sec+'초'
    }

    return lapTimeString;


  }

  renderItem = ({ item }) => {
    return (

      <TouchableOpacity onPress={()=>this.goToGraphDetail(item)}>
        <View style={styles.row}>
          <View style={styles.container}> 
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
              setMapBoundaries={this.getBoundInfo(item)}>   
 
              {/* <Marker
                coordinate={}
                title='title'
                description='des'
              /> */}

              <Polyline 
              coordinates={item.routeCoordinates} 
              strokeWidth={6} 
              strokeColor="#fc3d03"
              // geodesic={true}
              />
            </MapView>

          </View>
          <View>
            <View style={styles.nameContainer}>
              <Text>거리 : {item.distance}m</Text>
              <Text>시간 : {this.getLapTime(item.lapTime)}</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(GraphDetail);

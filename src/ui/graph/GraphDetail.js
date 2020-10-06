import React, { Component } from 'react';
import {
  StyleSheet, 
  View, 
  Text,
  Image,
} from 'react-native';
import MapView, {
  Polyline,
  Marker,
} from "react-native-maps";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import { Dimensions } from 'react-native';

import { LineChart } from "react-native-chart-kit";
import { Button } from 'react-native-paper';
 
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

 
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
 
  getBoundInfo = () => ({
    northEast: this.props.route.params.routeInfo.boundInfo.northEast,
    southWest: this.props.route.params.routeInfo.boundInfo.southWest,
  })

  shareRouteItem = () => {

    let itemInfo = []

    itemInfo.push(this.props.route.params.routeInfo)
    
    this.props.navigation.navigate('ChatRoomListToShare',
    {
      itemInfo : itemInfo
    }
    )
    
  }
 
  render() {
    return (
      <View style={styles.rootContainer}> 
        <View style={styles.mapContainer}>
          <MapView style={styles.map}
            initialRegion={{
              latitude: this.props.route.params.routeInfo.centerInfo.latitude,
              longitude: this.props.route.params.routeInfo.centerInfo.longitude,
              latitudeDelta: this.props.route.params.routeInfo.deltaInfo.latitudeDelta*2,
              longitudeDelta: this.props.route.params.routeInfo.deltaInfo.longitudeDelta*2,
            }}
            loadingEnabled={true}
            liteMode={false}
          setMapBoundaries={this.getBoundInfo()}
          >

            <Marker
              coordinate={
                {
                  latitude: this.props.route.params.routeInfo.routeCoordinates[0].latitude,
                  longitude: this.props.route.params.routeInfo.routeCoordinates[0].longitude,
                }
              }
              title='출발'>
              <View>
                <Image
                  style={{ alignItems: 'flex-start', height: 50, width: 50, resizeMode: 'center' }}
                  source={require('../../res/start-flag.png')} // first way (local)
                  resizeMethod='resize' />
              </View>
            </Marker>

            <Marker
              coordinate={
                {
                  latitude: this.props.route.params.routeInfo.routeCoordinates[this.props.route.params.routeInfo.routeCoordinates.length-1].latitude,
                  longitude: this.props.route.params.routeInfo.routeCoordinates[this.props.route.params.routeInfo.routeCoordinates.length-1].longitude,
                }
              }
              title='출발'>
                  <View>
                <Image
                  style={{ alignItems: 'flex-start', height: 50, width: 50, resizeMode: 'stretch' }}
                  source={require('../../res/goal-flag.png')} // first way (local)
                  resizeMethod='resize' />
              </View>
               
            </Marker>



            <Polyline
              coordinates={this.props.route.params.routeInfo.routeCoordinates}
              strokeWidth={12}
              strokeColor="#03c2fc"
            />

            <Polyline
              coordinates={this.props.route.params.routeInfo.routeCoordinates}
              strokeWidth={6}
              strokeColor="#233ff7"
            />

          </MapView>
        </View>

        <Button onPress={()=>this.shareRouteItem()}>share</Button>

        <View style={styles.graphContainer}>
          <View>
            <LineChart
              data={{
                labels: ["0", "", "", "", "","","","","", this.props.route.params.routeInfo.lapTime],
                datasets: [
                  {
                    data : this.props.route.params.routeInfo.speedArray
                  }
                ]
              }}
              
              segments = {5}
              fromZero={true}
              yLabelsOffset={1}
              withDots={false}
              withInnerLines={false}

              width={screenWidth}  
              height={screenHeight/2}
 
              yAxisSuffix="km/h"
              yAxisInterval={1} 
              
              chartConfig={{ //함수로 뺄까?
                backgroundColor: "#233ff7",
                backgroundGradientFrom: "#233ff7",
                backgroundGradientTo: "#3d6091",
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "10",
                  strokeWidth: "1",
                  stroke: "#ffa726"
                }
              }}
              style={{
               // 이쁜게 나중에
              }}
            />
          </View>
        </View>
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

  rootContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#4287f5'
  },

  mapContainer: {

    flex: 1,
    backgroundColor: 'red'

  },

  graphContainer: {
    flex: 1,
    backgroundColor: 'blue'
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

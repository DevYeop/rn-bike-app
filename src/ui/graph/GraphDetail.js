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
import { Dimensions } from 'react-native';

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";


const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 37.569889;
const LONGITUDE = 126.978175;

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

  goToGraphDetail = () => {

    this.props.navigation.navigate('GraphDetail')

  }

  getBoundInfo = item => ({
    northEast: this.props.route.params.routeInfo.boundInfo.northEast,
    southWest: this.props.route.params.routeInfo.boundInfo.southWest,
  })

  getStartPoint = item => ({

  })


  render() {
    return (




      <View style={styles.rootContainer}>
        {console.log('클릭된 아이템으로부터 받은 props'),
          console.log(this.props.route.params.routeInfo)}
        <View style={styles.mapContainer}>
          <MapView style={styles.map}
            initialRegion={{
              latitude: this.props.route.params.routeInfo.centerInfo.latitude,
              longitude: this.props.route.params.routeInfo.centerInfo.longitude,
              /**
               * 델타값에 2를 곱해주는 이유:
               * - 
               */
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
                    latitude:this.props.route.params.routeInfo.routeCoordinates[0].latitude,
                    longitude: this.props.route.params.routeInfo.routeCoordinates[0].longitude,
                  }
                }
                title='출발점'
                description='출발시각 :'
              />

            <Polyline
              coordinates={this.props.route.params.routeInfo.routeCoordinates}
              strokeWidth={6}
              strokeColor="#fc3d03"
            // geodesic={true}
            />
          </MapView>
        </View>

        <View style={styles.graphContainer}>
          <View>
            <LineChart
              // 이거 하고 안하고 차이가 뭐지?
              // bezier
              data={{
                labels: ["January", "February", "March", "April", "May", "June"],
                datasets: [
                  {
                    data: [
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100
                    ]
                  }
                ]
              }}
              width={screenWidth} // from react-native
              height={screenHeight / 2}
              yAxisLabel="$"
              yAxisSuffix="km/h"
              yAxisInterval={1} // optional, defaults to 1

              chartConfig={{ //함수로 뺄까
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#fb8c00",
                backgroundGradientTo: "#ffa726",
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726"
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
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

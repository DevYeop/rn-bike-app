import React from "react";
import {
    StyleSheet,
    View,
    Platform, 
    Text,
    Button
} from "react-native";
import MapView, {
    AnimatedRegion,
    Polyline,
    PROVIDER_GOOGLE
} from "react-native-maps";

import Geolocation from '@react-native-community/geolocation';
import haversine from "haversine";
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

import { connect } from 'react-redux';
import { addRecordedRoute } from '../../actions/Actions'
import { bindActionCreators } from 'redux'; 
import { TouchableOpacity } from "react-native-gesture-handler";

import firestore from '@react-native-firebase/firestore';
import axios from 'axios';
 
class RecordTap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startRecordMilli: 0,
            stopRecordMilli: 0,
            recordStatus: false,
            countDone: true,
            latitude: 0, // todo : 유저 현 위치의 latlong으로 설정해야 함
            longitude: 0,
            speedArray: [],
            snappedRouteCoordinates : [],
            routeCoordinates: [],           // 녹화된 드라이빙 코스의 경위도 좌표 집합.
            distanceTravelled: 0,           // 드라이브 코스의 총 직선거리. 
            prevLatLng: {},
            heading: 0,                     // 차량 진행방향, 이를 기준으로 지도의 북쪽으로 정렬함.
            speed: 0,                       // 차량속도. 속도에 따라 지도 줌배율을 변경하기 위해 쓰임.
            coordinate: new AnimatedRegion({
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0,
                longitudeDelta: 0
            }),
        };

        this.setState({
            userInfo:this.props.userInfo,
        })
    }

    componentDidMount() {
        this.startWatchPosigion()
    }

    startWatchPosigion = () => {
        const { coordinate } = this.state;

        this.watchID = Geolocation.watchPosition(
            position => {
                const { routeCoordinates, distanceTravelled, speedArray } = this.state;
                const { latitude, longitude, heading, speed } = position.coords;
                
                const newCoordinate = {
                    latitude,
                    longitude
                };

                if (Platform.OS === "android") {
                    if (this.marker) {
                        coordinate.timing(newCoordinate).start();
                    }
                } else {
                    coordinate.timing(newCoordinate).start();
                }

                this.setState({
                    latitude,
                    longitude,
                    heading,
                    speed, // todo : 유저가 정지해 있을 때 0으로 set 해줘야함.
                    speedArray: speedArray.concat(parseInt(speed)),
                    routeCoordinates: routeCoordinates.concat([newCoordinate]),
                    distanceTravelled:
                        distanceTravelled + this.calcDistance(newCoordinate),
                    prevLatLng: newCoordinate
                });

            },
            error => console.log(error),
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 1000,
                distanceFilter: 10
            }

        );
    }
  
    getMapCamera = () => ({
        center: {
            latitude: this.state.latitude,
            longitude: this.state.longitude,
        },  
        pitch: 3,
        /**
         * 개발 중에 테스트하기 불편해서 잠시 주석처리 해놓음.
         */
        // heading: this.state.heading,
        heading:0,
        zoom: 18,
    });

    checkRecordingStatus() {
        if (this.state.recordStatus) {
            // 녹화가 아직 시작된 상태가 아니라면, 녹화를 시작한다.
            this.stopRecording();
            
        } else {
            // 녹화가 시작된 상태면, 녹화를 중단한다.
            this.startRecording();
        }
    }

    formatDate(date) {
        return date.getFullYear() + '년 ' +
            (date.getMonth() + 1) + '월 ' +
            date.getDate() + '일 ' +
            date.getHours() + '시 ' +
            date.getMinutes() + '분';
    }

    startRecording() {
 
        const time = new Date().getTime();
        const date = new Date(time); 
 
        this.setState({
            startRecordMilli : time,
            recordStatus: true,
            countDone: false
        })
    
        this.startWatchPosigion();
    }

    stopRecording() {
        this.setState({
            recordStatus: false
        })

        Geolocation.clearWatch(this.watchID); 

        this.getRouteInfo() // .then?
        this.resetRecordStatus()


        this.getRoadAPI(this.state.routeCoordinates)
    }

    getLapTime() {
        const stopRecordMilli = new Date().getTime();
        const timeGap = stopRecordMilli -  this.state.startRecordMilli
 
        const hour = Math.floor((timeGap/1000/60/60) << 0)
        const min = Math.floor((timeGap/1000/60) << 0)
        const sec = Math.floor((timeGap/1000) % 60)

        const lapTime = {
            hour : hour,
            min : min,
            sec : sec,
        }

        let lapTimeString = ''
    
        if(hour != 0){
          lapTimeString = hour+'시 '
        }
        if(min != 0){
          lapTimeString += min+'분 '
        }
        if(sec != 0){
          lapTimeString += sec+'초'
        }
        
        return lapTimeString;
      }

    resetRecordStatus() {
        this.setState({
            routeCoordinates: [],
            distanceTravelled: 0,
            speedArray: [],
        })
    }
 
    /**
     * getRouteInfo를 따로 두고, 스토어에 저장하는 함수를 따로 만들어서 귀속시키는 게 깔끔할 듯
     */
    getRouteInfo = () => {
        const info = this.state.routeCoordinates
  
        let minLat = info[0].latitude 
        let maxLat = info[0].latitude
        let minLong= info[0].longitude
        let maxLong = info[0].longitude

        for (var i = 0; i < info.length ; i++){
            
            if (minLat > info[i].latitude){
                minLat = info[i].latitude
            }else if (minLong > info[i].longitude){
                minLong = info[i].longitude
            }else if(maxLat < info[i].latitude){
                maxLat = info[i].latitude
            }else if(maxLong < info[i].longitude){
                maxLong = info[i].longitude
            }
        }

        const northEast = {
            latitude: maxLat,
            longitude: maxLong
        }

        const southWest = {
            latitude: minLat,
            longitude: minLong
        }
       
        const latitudeDelta = maxLat - minLat
        const longitudeDelta = maxLong - minLong
        const deltaInfo = {latitudeDelta: latitudeDelta, longitudeDelta:longitudeDelta}
        
        const boundaryCenterLat = (latitudeDelta/2) + minLat
        const boundaryCenterLong = (longitudeDelta/2) + minLong
        
        const distance = parseInt(this.state.distanceTravelled*1000)
        const centerInfo = {latitude: boundaryCenterLat, longitude: boundaryCenterLong}
        const boundInfo = {northEast: northEast, southWest: southWest}
        const lapTime = this.getLapTime()
        const avgSpeed = this.getAvgSpeed()


        /**
         * 여기서 routecorodinate를 roead로 스냅후 전달할 것
         * 
         */

        this.getRoadAPI(this.state.routeCoordinates)


         
        const routeInfo = {
            itemIndex : this.state.startRecordMilli,
            speedArray : this.state.speedArray,
            avgSpeed : avgSpeed,
            lapTime : lapTime,
            routeCoordinates: this.state.routeCoordinates,
            distance: distance, 
            boundInfo: boundInfo,
            centerInfo: centerInfo,
            deltaInfo: deltaInfo,
        }

 
        this.props.addRecordedRoute(routeInfo) 

        this.addFireStoreInfo(routeInfo) 
 
    }

    /**
     * 
     * 
     * @param {*} routeItem 새로 생성된 아이템의 정보
     */
    addFireStoreInfo = routeItem => {
        console.log('setFireStoreInfo called')

        const userIndex = this.props.userInfo.id
        const collectionName = 'routeItemCollection'

        const itemIndex = routeItem.itemIndex+''
        console.log('itemIndex :')
        console.log(itemIndex)

        console.log(routeItem)
 
        const itemsRef = firestore().collection(userIndex+collectionName);

        itemsRef.doc(itemIndex).set(
            { routeItem }
        );
    }
  

    getAvgSpeed = () => {
        const speedArray = this.state.speedArray
        let avgSpeed = 0;

        for (var i = 0; i < speedArray.length; i++) {
            avgSpeed += speedArray[i]
        }

        avgSpeed = avgSpeed / speedArray.length
        return avgSpeed
    }

    /**
     * 이전에 수신한 LatLng과 현재 수신한 Latlng 사이의 거리를 계산함.
     * 총 주행한 거리를 계산하기 위해 쓰임.
     *           prevLatLng 유저의 과거 위치
     * @param {*} newLatLng 유저의 현재 위치
     */
    calcDistance = newLatLng => {
        const { prevLatLng } = this.state;
        return haversine(prevLatLng, newLatLng) || 0;
    };

    showSpeed = () => {
        return (
            parseInt(this.state.speed)
        )
    }

    /**
     * 
     * @param {} routeCoordinates 
     */
    getRoadAPI  = routeCoordinates => { 

    //     let newRouteCoordinates = 'points='
    //     let routeLatitue = ''
    //     let routeLongitude = ''

        
    // for (var i = 0 ; i < routeCoordinates.length ; i++){
    
    //     routeLatitue   = routeCoordinates[i].latitude+','

    //     if( i == routeCoordinates.length-1){
    //         routeLongitude = routeCoordinates[i].longitude  
    //     }else{
    //         routeLongitude = routeCoordinates[i].longitude+'|'  
    //     }
        
    //     newRouteCoordinates += routeLatitue+routeLongitude
    // }

 
        // const params1 = 'points=35.461337,-97.533734|35.462222,-97.531993'// 호주 좌표
        // const params2 = '37.480483,126.930500|37.481247,126.930420'// 울나라 좌표
        // const params3 = 'points=35.343465,137.095879|35.344012,137.098465'// 닛본 좌표

        let roadUrlFull = 'https://apis.openapi.sk.com/tmap/road/matchToRoads?version=1&appKey=l7xxd873259fd9804fe693601cecb92bd4b7'

        const queryString = require('query-string');
 
        const data = { 
            responseType: '1',
            coords: '126.87793387437,35.237431207701|126.87819495169,35.237856164051|126.87844491764,35.238331114558|126.87871432615,35.23881162032|126.87900595473,35.239300458849|126.87930591512,35.239819849619|126.8796392052,35.240367015588|126.87994472025',
        };
        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: queryString.stringify(data),
        };
        axios(roadUrlFull,options)
        .then(response => {console.log(response)})
        .catch(reason => {console.log('reason', reason)})
 
        // const FormData = require('form-data');
 
        // const formData = new FormData();
        // formData.append('responseType', '1');
        // formData.append('coords', '37.480483,126.930500|37.481247,126.930420');
         
        // fetch(roadUrlFull, {
        //     method: 'POST',
            
        //     body: JSON.stringify({
        //         responseType: '1',
        //         coords: '37.480483,126.930500|37.481247,126.930420',
        //     })
        // }).then(response => {console.log('response', response)})
        // .catch(reason=>{console.log('reason', reason)})

 
    }

    setSnappedPoint = (json) => {
 
        console.log('json.snappedPoints',json.snappedPoints)
        
        const snappedPoints = json.snappedPoints
        const snappedPointArray = []

        let snappedPoint = {
            latitude:0,
            longitude:0,
        };

        let snappedLat
        let snappedLong

        for (var i = 0; i < snappedPoints.length; i++) {
             
            snappedLat = snappedPoints[i].location.latitude
            snappedLong = snappedPoints[i].location.longitude
 
            snappedPoint.latitude = snappedLat
            snappedPoint.longitude = snappedLong

            snappedPointArray.push(snappedPoint)

        }

 

        console.log('snappedPointArray', snappedPointArray)
 

        this.setState({
            snappedRouteCoordinates: snappedPointArray,
            latitude: snappedPointArray[0].latitude,
            longitude: snappedPointArray[0].longitude,
        })

        console.log('스냅 후 state ', this.state)

        // this.setState({
        //     latitude,
        //     longitude,
        //     heading,
        //     speed, // todo : 유저가 정지해 있을 때 0으로 set 해줘야함.
        //     speedArray: speedArray.concat(parseInt(speed)),
        //     routeCoordinates: routeCoordinates.concat([newCoordinate]),
        //     distanceTravelled:
        //         distanceTravelled + this.calcDistance(newCoordinate),
        //     prevLatLng: newCoordinate
        // });

        

        
        
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    followUserLocation={true}
                    loadingEnabled={true}
                    showsUserLocation={true} // todo : 유저 현위치 표시속도가 늦음. 높여야함!
                    showsMyLocationButton={true}
                    showsCompass={true}
                    zoomTapEnabled={true}
                    zoomControlEnabled={true}
                    rotateEnabled={true}
                    camera={this.getMapCamera()}>
                      
                      {
                          console.log('스냅 데이터', this.state.snappedRouteCoordinates)
                      }
                    <Polyline coordinates={this.state.routeCoordinates} strokeWidth={12} strokeColor="#4334eb" />
 
                    <Polyline coordinates={this.state.routeCoordinates} strokeWidth={6} strokeColor="#fc3d03" />

                </MapView>
                <Text style={styles.speed}>{this.showSpeed()}km/h</Text>
                <ActionButton
                    buttonColor="rgba(231,76,60,1)"
                    position="center"
                    degrees={90}
                    backgroundTappable={true}
                    onPress={() => this.checkRecordingStatus()}
                    renderIcon={active => active ?
                        (<Icon name="md-stop" style={styles.actionButtonIcon} />)
                        : (<Icon name="logo-google-playstore" style={styles.actionButtonIcon} />)}>
                    <ActionButton.Item buttonColor='#9b59b6' title="New Task" active={false}>
                        <Icon name="md-stop" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                </ActionButton>
                <TouchableOpacity onPress={()=>this.getRoadAPI()}>
                {/* <Button title='road api'/> */}
                </TouchableOpacity>
                {/* {!this.state.countDone ? ( todo : roadAPI 적용 후 개발완료 할 것
                    <CountdownCircleTimer
                        style={styles.countDownTimer}
                        key={this.state.countDownKey}
                        onComplete={() => {
                            this.setState({
                                countDone: false,
                            })
                        }}
                        isPlaying
                        strokeWidth={20}
                        strokeLinecap='square'
                        duration={5}
                        colors={[['#004777', 0.33], ['#F7B801', 0.33], ['#A30000']]}>
                        {({ remainingTime, animatedColor }) => (
                            <Animated.Text
                                style={{ ...styles.remainingTime, color: animatedColor }}>
                                {remainingTime}
                            </Animated.Text>
                        )}
                    </CountdownCircleTimer>
                ) : null} */}
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
        addRecordedRoute,
    }, dispatch)
);

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
    },
    speed: {
        marginLeft: 10,
        marginTop: 50,
        fontSize: 32,
        color: 'blue',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: "center",
        marginHorizontal: 10
    },
    buttonContainer: {
        flexDirection: "row",
        marginVertical: 20,
        backgroundColor: "transparent"
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    countDownTimer: {
        alignItems: 'center',
        justifyContent: 'center',
    }
});
 
export default connect(mapStateToProps, mapDispatchToProps)(RecordTap);

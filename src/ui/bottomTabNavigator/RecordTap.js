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
import { addRecordedRoute } from '../../actions/FriendsActions'
import { bindActionCreators } from 'redux'; 
import { TouchableOpacity } from "react-native-gesture-handler";

import firestore from '@react-native-firebase/firestore';
  
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
        const startRecordTime = this.formatDate(date)
 
        this.setState({
            startRecordMilli : time,
            recordStatus: true,
            countDone: false
        })
   
        /**
         * todo : 이미 시작된 watchPosigion이 있는지 검사 후 실행하도록 수정해야함.
         */
        this.startWatchPosigion();
    }

    stopRecording() {
        this.setState({
            recordStatus: false
        })

        Geolocation.clearWatch(this.watchID); 

        this.getRouteInfo() // .then?
        this.resetRecordStatus()
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

        const routeInfo = {
            speedArray : this.state.speedArray,
            avgSpeed : avgSpeed,
            lapTime : lapTime,
            routeCoordinates: this.state.routeCoordinates,
            distance: distance, 
            boundInfo: boundInfo,
            centerInfo: centerInfo,
            deltaInfo: deltaInfo,
        }



        /**
         * 여기서 fire-store로 저장해야함. add
         * 
         * 
         * collection(유저 아이디)
         * - doc
         * - doc
         * - doc (유저 정보)
         * .
         * .
         * .
         * - doc (아템 목록)
         *  -- collection (아템 목록)
         *   --- doc (아템 아이디)
         * 
         */
        this.setFireStoreInfo(routeInfo)
        this.getFireStoreInfo()

 
        this.props.addRecordedRoute(routeInfo)
    }


    setFireStoreInfo = routeInfo => {

        console.log('setFireStoreInfo this.props.userInfo.routeItem')
        console.log(this.props.userInfo.routeItem)

        const preRouteInfo = this.props.userInfo.routeItem

        const citiesRef = firestore().collection(this.props.userInfo.id);

        citiesRef.doc("routeInfo").set(
            { preRouteInfo }
        );
    }

    getFireStoreInfo = () => {

        const citiesRef = firestore().collection(this.props.userInfo.id).doc("routeInfo");

        citiesRef.get().then(function (doc) {
            if (doc.exists) {
                console.log("Document data:", doc.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });

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

    getRoadAPI  = () => { 
        /**
         * todo : 녹화 중에 계속 road api를 호출하지 않았으면 좋겟는데.. 잠시보류
         */
        fetch('https://roads.googleapis.com/v1/snapToRoads?path=-35.27801,149.12958|-35.28032,149.12907|-35.28099,149.12929|-35.28144,149.12984|-35.28194,149.13003|-35.28282,149.12956|-35.28302,149.12881|-35.28473,149.12836&interpolate=true&key=AIzaSyCiBqROXrj7009fX49-BxlGpd1NyhIldYA')
        .then((response) => response.json())
        .then((json) => {
            console.log('json');
            console.log(json);  
          return json.movies;
        })
        .catch((error) => {
          console.error(error);
        });

        alert('getRoadAPI')
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
                <Button title='road api'/>
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

import React from "react";
import {
    StyleSheet,
    View,
    Platform,
    Animated,
    Text,
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
import { sortAndDeduplicateDiagnostics } from "typescript";

const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 37.569889;
const LONGITUDE = 126.978175;

class RecordTap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startRecordMilli: 0,
            stopRecordMilli: 0,
            recordStatus: false,
            countDone: true,
            latitude: LATITUDE,
            longitude: LONGITUDE,
            routeCoordinates: [],           // 녹화된 드라이빙 코스의 경위도 좌표 집합.
            distanceTravelled: 0,           // 드라이브 코스의 총 직선거리. 
            prevLatLng: {},
            heading: 0,                     // 차량 진행방향, 이를 기준으로 지도의 북쪽으로 정렬함.
            speed: 0,                       // 차량속도. 속도에 따라 지도 줌배율을 변경하기 위해 쓰임.
            coordinate: new AnimatedRegion({
                latitude: LATITUDE,
                longitude: LONGITUDE,
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
                const { routeCoordinates, distanceTravelled } = this.state;
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
                    speed,
                    /**
                     * 경위도 하나당 x 값으로 쓸 데이터 하나 추가하면 좋을 듯.
                     */
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

    // componentWillUnmount() {
    //     // Geolocation.clearWatch(this.watchID);
    // }

    getMapRegion = () => ({
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
    });

    getMapCamera = () => ({
        center: {
            latitude: this.state.latitude,
            longitude: this.state.longitude,
        },
        pitch: 3,
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

        // 녹화를 시작한 시기정보. 각 아이템이 언제 탄생(?) 했는지 표시할 때 사용한다.
        // 아이템 인덱스로 활용해도 좋을듯?
        const startRecordTime = this.formatDate(date)

        alert(startRecordTime);

        this.setState({
            startRecordMilli : time,
        })
        






        /**
         * todo : 여기서 시작 측정 시작
         */
        this.setState({
            recordStatus: true,
            countDone: false
        })
        /**
         * todo : 이미 시작된 watchPosigion이 있는지 검사 후 실행하도록 수정해야함.
         */
        this.startWatchPosigion();
    }

    stopRecording() {



        const stopRecordMilli = new Date().getTime();

        const timeGap = stopRecordMilli -  this.state.startRecordMilli
        

        console.log('걸린시간')
        console.log(timeGap)

        const hour = Math.floor((timeGap/1000/60/60) << 0)
        const min = Math.floor((timeGap/1000/60) << 0)
        const sec = Math.floor((timeGap/1000) % 60)

        console.log('분')
        console.log(min)

        console.log('초')
        console.log(sec)

        const lapTime = {
            hour : hour,
            min : min,
            sec : sec,
        }
 

          /**
         * todo : 여기서 시작 측정 중단
         * - 시작-중단 시간의 간격구하기
         */

        this.setState({
            recordStatus: false
        })
        Geolocation.clearWatch(this.watchID); 
        
        console.log('총 이동거리')
        console.log(this.state.distanceTravelled)


        this.resetPolyline()
        this.calculateRouteInfo(this.state.routeCoordinates, lapTime)
    }

    resetPolyline() {
        this.setState({
            routeCoordinates: []
        })
    }

    /**
     * 
     * @param {*} info 
     */
    calculateRouteInfo = (info, lapTime) => {
        let minLat = info[0].latitude 
        let maxLat = info[0].latitude
        let minLong= info[0].longitude
        let maxLong = info[0].longitude

        console.log('전달받은 인자')
        console.log(info)

        console.log('min lat')
        console.log(minLat)

        console.log('계산 중..................')
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
         
        console.log('northEast ')
        console.log(northEast)
        console.log('southWest ')
        console.log(southWest)

        const latitudeDelta = maxLat - minLat
        const longitudeDelta = maxLong - minLong
        const deltaInfo = {latitudeDelta: latitudeDelta, longitudeDelta:longitudeDelta}
        

        const boundaryCenterLat = (latitudeDelta/2) + minLat
        const boundaryCenterLong = (longitudeDelta/2) + minLong
 
        const distance = parseInt(this.state.distanceTravelled*1000)

        /**
         * 녹화가 종료되면 아래의 정보를 저장하게 됨.
         * -녹화경로(경위도 집합 ) + (경위도별로 시간?)
         * -총 이동거리
         * -총 이동시간
         * -
         */

        const centerInfo = {latitude: boundaryCenterLat, longitude: boundaryCenterLong}

        const boundInfo = {northEast: northEast, southWest: southWest}

        const routeInfo = {
            lapTime : lapTime,
            routeCoordinates: this.state.routeCoordinates,
            distance: distance, 
            boundInfo: boundInfo,
            centerInfo: centerInfo,
            deltaInfo: deltaInfo,
        }
  
        this.props.addRecordedRoute(routeInfo)
        
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
        
                <Text style={styles.speed}>{this.showSpeed()}km/h + {this.props.valueFromParent}</Text>
                <ActionButton
                    buttonColor="rgba(231,76,60,1)"
                    position="center"
                    degrees={90}
                    backgroundTappable={true}
                    onPress={() => this.checkRecordingStatus()}
                    // onPress={() => this.childFunction()}
                    renderIcon={active => active ?
                        (<Icon name="md-stop" style={styles.actionButtonIcon} />)
                        : (<Icon name="logo-google-playstore" style={styles.actionButtonIcon} />)}>
                    <ActionButton.Item buttonColor='#9b59b6' title="New Task" active={false}>
                        <Icon name="md-stop" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                </ActionButton>

                {/* {!this.state.countDone ? (
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

import * as React from 'react';
import {
    PermissionsAndroid,
  } from 'react-native';

/**
 * todo :
 * 0_ 안드로이드 퍼미션 정책 재확인
 * 1_ 앱 초기진입시 다중 권환권한 요청이 가능한가?
 * 2_ 다중 권한요청 불가시, 각 권한별로 함수 만들어줘야함.
 *    아래는 필요한 권한목록.
 * PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.CAMERA" />
 */
const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "주행경로 녹화를 위한 위치권한 요청!",
          message: "주행경로 녹화를 위해 유저 위치획득에 대한 권한이 필요합니다.",
          buttonNeutral: "나중에",
          buttonNegative: "거절",
          buttonPositive: "수락"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("위치권한 수락");
      } else {
        console.log("위치권한 거절");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  export default requestLocationPermission;
  


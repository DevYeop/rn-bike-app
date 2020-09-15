# 주요기능
- 드라이빙 코스를 녹화함. 
- 서드파티 네비앱에게 경로안내 전달
- 지도상에서 녹화된 드라이빙 코스를 보여주고, 속도 및 거리 등의 정보를 그래프의 형태로 보여줌.
- 유저간 채팅을 통해서 녹화된 드라이빙 코스를 공유할 수 있음.

# 클라이언트 사이드 환경:
- react-native-cli: 2.0.1
- react-native: 0.63.2
- android min16 max29 target29

 Node v14.7.0, npm v6.14.7, react v16.13.1, react-native v0.63.2, @react-navigation/native v5.7.3, @react-navigation/stack v5.9.0, redux v4.0.5, and react-redux v7.2.1.

# 백앤드 사이드 환경:
- Linux Ubuntu 16.04
- nginx v
- mariadb v
- php v7.2.31

# 테스트 하는 법
- android : terminal로 rnBikeApp 폴더 안에서, npx react-native run-android를 실행.
- ios : 

# 설명
- props
- state
- nested navigator
- flatlist
- life cycle
- bridge?
- state, props, store, component
- func vs class?
- es6?
- RN architect?
- reactNativeHook?

# 버그목록
- 지도에서 나침반을 누르면 화면에 가려져있는, 1첫번째 탭의 화면의 onPress가 작동함.

# 확인필요
- 안드로이드 버전별 permission policy
- optimize FlatList https://reactnative.dev/docs/0.61/optimizing-flatlist-configuration
- rn 버전별 gps depreadted https://github.com/react-native-community/react-native-geolocation

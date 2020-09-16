import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Button } from 'react-native';

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>You have {this.props.friends2.current.length} friends.</Text>

        <Button
          title="Add some friends"
          onPress={() =>
            this.props.navigation.navigate('Friends')
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


/**
 * make friends accessible to your screens with the mapStateToProps function. 
 * This function maps the state from the FriendsReducer to the props in the two screens.
 * @param {*} state state from the FriendsReducer
 */

const mapStateToProps = (state) => {
  // const 변수명이 recuder가 반환한  property랑 변수이름이 같은이유는, 비구조활할당 때문임
  const { friends2 } = state
  return { friends2 }
};

// export default HomeScreen;
export default connect(mapStateToProps)(HomeScreen);
//Tasks Component
const Tasks = (props) => {
    const { navigate } = props.navigation;
    //function to go to next screen
    goToNextScreen = () => {
        return navigate('Detail');
    }
    return (
     <View>
       <FlatList
         data={[
           {key: 'Task 1'},
           {key: 'Task 2'},
           {key: 'Task 3'},
           {key: 'Task 4'},
           {key: 'Task 5'},
         ]}
         renderItem={({item}) => {
             return(
               <TouchableHighlight onPress={() => this.goToNextScreen()}>
                    <Text >{item.key}</Text>
               </TouchableHighlight>
             )
           }
         }
       />
     </View>
   );
}

//example for detail screen
const Detail = (props) => {
   const { navigate } = props.navigation;
   return(
       <View><Text>Detail Screen</Text></View>
   );
}

//initial screen
const App = StackNavigator({
 Tasks: {screen: Tasks},
 Detail: {screen: Detail},
})
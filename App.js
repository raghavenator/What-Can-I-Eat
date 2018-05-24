/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TextInput,
  TouchableHighlight,
  ListView,
  Dimensions
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import {WheelPicker, DatePicker, TimePicker} from 'react-native-wheel-picker-android'
import GridView from 'react-native-super-grid';
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});


/*const ImageHeader = props => (
  <View style={{ backgroundColor: '#eee' }}>
    <Image
      style={StyleSheet.absoluteFill}
      source={require('./images/candy.jpg')}
    />
    <Header style={{ backgroundColor: 'transparent' }}/>
  </View>
);*/

type Props = {};
class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        text: 'Useless Placeholder',
        selectedItem : 0,
     };
    this.onItemSelected = this.onItemSelected.bind(this);
  }
  static navigationOptions = {
      title: 'What Snacks Can I Eat In',
      headerStyle: {
        backgroundColor: '#ff6347',
      },
      headerTitle: (
            <Image source={require('./images/candy.jpg')}/>
        ),
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
  };
  onItemSelected(event){
    this.setState({
            selectedItem: event.data,
    })
  }
  render() {
    let wheelPickerData = [50,100,150,200,250,300,350,400,450,500,550,600,650,700,750,800,850,900,950,1000];
    let {height, width} = Dimensions.get('window');
    return (
      <View style={{flex: 1, flexWrap:'wrap', alignContent: 'stretch', backgroundColor: '#5bc0de'}}>
          <View style={{height: 150, alignItems:'center', justifyContent:'center'}}>
            <Image
              style={{flex: 1, resizeMode: 'contain', width: 350, position: 'relative',right: 50}}
              source={require('./images/what_snacks.png')}
             />
            <Image
              style={{flex: 1, resizeMode: 'contain', width: 300, position: 'relative', left: 50}}
              source={require('./images/can_i_eat_in.png')}
             />
          </View>
          <View style={{height: 300, alignItems:'center', justifyContent:'center'}}>
          <WheelPicker
                onItemSelected={(event)=>this.onItemSelected(event)}
                isCyclic
                isCurved
                isAtmospheric
                itemTextSize = {140}
                itemTextColor = {'#f4f3ea'}
                curtainColor = {'#6dc9dd'}
                selectedItemTextColor = {'#f4f3ea'}
                data={wheelPickerData}
                style={styles.wheelPicker}/>
          </View>
          <View style={{height: 150, alignItems:'center', justifyContent:'center'}}>
             <TouchableHighlight
                style={{width:300, height: 70, alignItems: 'center', padding: 10, backgroundColor: '#ff6347', justifyContent:'center', borderRadius:10}}
                onPress={() => {
                    this.props.navigation.navigate('Details', {
                      calories: this.state.selectedItem,
                    });
                   }}
                >
              <Image style={{flex: 1, resizeMode: 'contain', width: 200, position: 'relative',top: -5}} source={require('./images/caloriesq.png')} />
             </TouchableHighlight>
          </View>
      </View>
    );
  }
}

class DetailsScreen extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        calories: 0,
        caloriestoscreen: new Array(),
        data: new Array(),
       };
      this.foodnames = new Array();
      //this.foodnames = ['name];
      this.calories = new Array();
  }
  static navigationOptions = ({ navigation }) => {
       const { params } = navigation.state;
       //this.calories = params.calories;
       return {
          title: params ? 'What Snacks Can I Eat In ' + params.calories + ' calories?' : 'We came here first',
          headerStyle: {
                  backgroundColor: '#ff6347',
                },
          headerTitle: (
             <Image source={require('./images/candy.jpg')}/>
           ),
          headerTintColor: '#fff',
          headerTitleStyle: {
          fontWeight: 'bold',
          },
        }
  };
   componentDidMount() {
       var apiKey = "4qIqnNiqngt98FxKPrItZKfEWy4wHANYMqJFzNNn";
       var format = "json";
       var nutrients = '208';
       var sort = 'n';
       var type = 's';
       var q = 'chocolate';
       var fg = '0100';
       var nbdno = '';
       const calories = this.props.navigation.getParam('calories');
       //var url = "http://api.nal.usda.gov/ndb/search/?format=" + format + "&q=" + q + "&type=" + type + "&sort=" + sort + "&api_key=" + apiKey;
      //var url = "http://api.nal.usda.gov/ndb/reports/?format=" + format + "&nutrients=" + nutrients + "&sort=" + sort + "&api_key=" + apiKey + "&fg=" + fg + "&ndbno=" + nbdno;
       var url = "https://api.nal.usda.gov/ndb/nutrients/?format=json&api_key=4qIqnNiqngt98FxKPrItZKfEWy4wHANYMqJFzNNn&nutrients=208&fg=2500&sort=c";
     fetch(url, {
     method: 'POST',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json'
         },
      })
     .then(response => response.json())
     .then(data => {
        console.log(data);
        let food = data.report.foods;
        for (x in food) {
            cals = parseInt(food[x].nutrients[0]['value']);
            if (cals < calories)
            this.foodnames.push({
                name: food[x]['name'],
                calories: cals,
            });
        }
        this.setState({
            data: this.foodnames
         })
        //console.log(this.state.data);
     })
     .catch((error) => {
           console.error(error);
      });
   }
  render() {
    const list = this.state.data;
    return (
      <View style={{backgroundColor: '#6dc9dd', flex:1}}>
      <GridView
          itemDimension={130}
          items={list}
          style={styles.gridView}
          renderItem={item => (
            <View style={[styles.itemContainer]}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemCode}> Calories: {item.calories}</Text>
            </View>
          )}
       />
      </View>
    );
  }
}

const RootStack = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Details: {
      screen: DetailsScreen,
    },
  },
  {
    initialRouteName: 'Home',
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  wheelPicker: {
    width: 200,
    height: 300
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
    height: 150,
    backgroundColor: '#ffffff',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  gridView: {
    paddingTop: 25,
    flex: 1,
  },
  itemName: {
      fontSize: 16,
      color: 'black',
      fontWeight: '600',
      justifyContent:'center',
},
  itemCode: {
      fontWeight: '600',
      fontSize: 12,
      color: 'grey',
},
});

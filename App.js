/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import axios from 'axios';
import React, { useState, } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button
  ,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import RNFetchBlob from 'rn-fetch-blob';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

var width = Dimensions.get('window').width;

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ImageBackground, Image, Dimensions } from "react-native";

import { Col, Row, Grid } from "react-native-easy-grid";

import { RNCamera, FaceDetector } from 'react-native-camera';

class StudentDetails extends React.Component {

  constructor(props) {
    super()
    console.log(props.route.params.profilePic);
  }
  render = () => {

    const styles = StyleSheet.create({
      row: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        justifyContent: "space-between"
      }
    });

    return <View>
      <Grid>
        <View style={{ flexDirection: 'row' }}>
          <Text>PERSON IDENTIFIED</Text>
        </View>

        <View>

          {/* <Col style={{justifyContent:'center', flex:1}}> */}
          <Text style={{ backgroundColor: 'green', textAlign: 'center', height: 30, paddingTop: 8, color: 'white' }}>PERSON IDENTIFIED</Text>
          {/* </Col> */}

        </View>
        <Row size={2} style={{ marginTop: 50 }}>

          <Col><Text>Name</Text></Col>
          <Col><Text>{this.props.route.params.name}</Text></Col>

        </Row>
        <Row size={2} style={{ backgroundColor: 'blue', marginTop: 50 }}>

          <Col><Text>Contact</Text></Col>
          <Col><Text>{this.props.route.params.contact}</Text></Col>

        </Row>
        <Row size={2} style={{ backgroundColor: 'magenta', marginTop: 50 }}>

          <Col><Text>Hostel Name</Text></Col>
          <Col><Text>{this.props.route.params.hostel.name}</Text></Col>

        </Row>
        <View style={{ flexDirection: 'row', marginTop: 40 }}>
          <Image style={{
            resizeMode: 'contain',
            flex: 1,
            aspectRatio: 1 // Your aspect ratio
          }} source={{ uri: this.props.route.params.profilePic }} />
        </View>

      </Grid>
    </View>

  }

}

class TakePictureScreen extends React.Component {

  // let [, setState] = useState(false)

  state = {
    processing: false
  }

  styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'black',
    },
    preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    capture: {
      flex: 0,
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: 15,
      paddingHorizontal: 20,
      alignSelf: 'center',
      margin: 20,
    },
  });

  takePicture = async () => {uploadPath
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      var data = await this.camera.takePictureAsync(options);
      // console.log(data);

      // axios.get('http://192.168.10.4:8080/api/auth/verify')

      var uploadPath = 'http://192.168.10.8:5000/api/auth/verify?verify=true';

      // try {
        this.setState({ processing: true });
        // axios.post('http://192.168.10.8:5000/api/auth/verify?verify=true',
        //   {
        //     data: data.base64
        //   }
        // ).then((res) => {
        //   this.setState({ processing: false });
        //   if (res.data.success) {

        //     console.log("response received");
        //     console.log(res.data.name);
        //     console.log(res.data.hostel);
        //     this.props.navigation.navigate('Details', res.data.user);
        //   } else {

        //   }

        // });

        // let ret = await RNFetchBlob.fetch(
        //   'POST',
        //   `http://192.168.10.8:5000/api/auth/verify?verify=true`,
        //   {
        //     'Content-Type': 'multipart/form-data'
        //   },
        //   [
        //     {
        //       name: 'fila',
        //       filename: 'student-image.png',
        //       type: 'image/png',
        //       data: RNFetchBlob.wrap(data.uri),
        //     }
        //   ],
        // );


        // const postImage = (imagePath) => {
          const photo = {
            uri: data.uri,
            name: 'image.png',
            type: 'image/png',
          };
          const cdata = new FormData();
          cdata.append('fila', photo);
          const config = {
            method: 'POST',
            body: cdata,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'multipart/form-data',
            },
          };
          console.log("feting")
         fetch(uploadPath, config);
        // }

        // postImage(pathToYourFile)

        // console.log(ret)
      // } catch (e) {
      //   console.log(e.message);
      // }
      // return ret;

      console.log(data.uri);
    }
  };
  render = () => {


    return <View style={this.styles.container}>
      {this.state.processing && <ActivityIndicator size="large" color="#0000ff" />}
      <RNCamera
        ref={(ref) => {
          this.camera = ref;
        }}
        style={this.styles.preview}
        type={RNCamera.Constants.Type.back}
        // captureTarget={}
        flashMode={RNCamera.Constants.FlashMode.off}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        onGoogleVisionBarcodesDetected={({ barcodes }) => {
          console.log(barcodes);
        }}
      />
      <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
        <TouchableOpacity onPress={this.takePicture.bind(this)} style={this.styles.capture}>
          <Text style={{ fontSize: 14 }}> SNAP </Text>
        </TouchableOpacity>
      </View>
    </View>
  }
}

function HomeScreen({ navigation }) {


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column"
    },
    image: {
      width: '100%',
      flex: 1,
      resizeMode: "cover",
      justifyContent: "center"
    },
    text: {
      color: "grey",
      fontSize: 30,
      fontWeight: "bold"
    }
  });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ImageBackground source={require("./components/imags/back.jpg")} style={styles.image}>
        {/* <Text style={styles.text}>Inside</Text> */}
        <Button title="Scan Person" onPress={() => {
          navigation.navigate('TakePicture');
        }}><Text>Scan Person</Text></Button>
      </ImageBackground >
    </View >
  );
}


const Stack = createStackNavigator();

const App = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator headerMode='none' screenOptions={{
          headerMode: 'none'
        }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="TakePicture" component={TakePictureScreen} />
          <Stack.Screen name="Details" component={StudentDetails} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;

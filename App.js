/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import axios from 'axios';
import React, { useState } from 'react';
import Geolocation from '@react-native-community/geolocation';

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
    ActivityIndicator,
    Alert,
    TextInput,
    AsyncStorage
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

let targetAPI = 'http://192.168.18.101:5050';

class Dashboard extends React.Component {

    state = {
        visits: [
            {
                verified: true,
                location: {
                    address: "Sitara colont"
                },
                date: "11/2/2018"
            },
            {
                verified: true,
                location: {
                    address: "Sitara colont"
                },
                date: "12/2/2018"
            },
            {
                verified: true,
                location: {
                    address: "Sitara colont"
                },
                date: "13/2/2018"
            },
            {
                verified: true,
                location: {
                    address: "Sitara colont"
                },
                date: "13/2/2018"
            }
        ]
    }


    componentDidMount = () => {

        this.props.navigation.addListener('focus', () => {


            AsyncStorage.getItem('userID').then((id) => {

                axios.post(targetAPI + '/loadvisits', { id: id.toString() }).then((resp) => {

                    if (resp.data.success) {
                        this.setState({ visits: resp.data.visits });
                    }

                });


            }).catch(() => {
                this.setState({ processing: false });

            });

        });

    }

    render = () => {

        const styles = StyleSheet.create({
            container: {
                // flex: 1,
                backgroundColor: "#fff",
                // alignItems: "center",
                // justifyContent: "flex-end",
                height: 40,
            },
            verify: {
                height: 50,
                // paddingTop: 40,
                backgroundColor: "#b8b1b1",
                width: '100%',
                alignItems: 'center'
            },
            font: {
                fontSize: 50
            }
        });

        return <View style={styles.container}>
            <TouchableOpacity onPress={() => {

                this.props.navigation.navigate('TakePicture');
            }} style={styles.verify}>
                <Text style={{ fontSize: 20 }}> Verify Meeting </Text>
            </TouchableOpacity>
            <Text style={{ alignItems: 'center', textAlign: 'center', padding: 20, backgroundColor: 'orange' }}>My Pending Vists</Text>
            {
                this.state.visits.map((visit) => {

                    return <View style={{ flex: 1, height: 20, backgroundColor: 'white', marginBottom: 20, paddingTop: 20, flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}><Text>{visit.date}</Text></View>
                        <View style={{ flex: 1 }}><Text>{visit.location.address}</Text></View>
                        <View style={{ flex: 1 }}><Text>{!visit.verified ? "Pending" : "Completed"}</Text></View>
                    </View>

                })
            }
        </View>

    }

}

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
                    flex: 1,
          <Image style={{
                        resizeMode: 'contain',
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
        inProcess: false,
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

    takePicture = async () => {


        if (this.camera) {
            const options = { quality: 0.5, base64: true };
            var data = await this.camera.takePictureAsync(options);

            var uploadPath = targetAPI + '/verify?verify=true';

            this.setState({ processing: true });

            const photo = {
                uri: data.uri,
                name: 'unknown.png',
                type: 'image/png',
            };
            const cdata = new FormData();
            cdata.append('fila', photo);

            const config = {
                method: 'POST',
                body: cdata,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
            };


            const onIDFetched = (userID) => {

                Geolocation.getCurrentPosition(info => {

                    cdata.append('longitude', info.coords.longitude);
                    cdata.append('latitude', info.coords.latitude);
                    cdata.append('userID', userID.toString());

                    // alert('sending now')
                    fetch(uploadPath, config).then((res) => {

                        return res.json();

                    }).then((res) => {

                        console.log("I receved")
                        console.log(res.success);

                        this.setState({ processing: false });


                        if (!res.success) {
                            Alert.alert("Person not identified");

                        } else {
                            Alert.alert(res.name + " verified at" + res.location);
                            this.props.navigation.navigate('Dashboard');

                        }

                    }).catch(() => {
                        this.setState({ processing: false });
                    });

                }, () => {
                    Alert.alert("Please enable your GPS!");
                });


            }

            AsyncStorage.getItem('userID').then(onIDFetched).catch(() => {
                this.setState({ processing: false });

            });



            console.log(data.uri);
        }
    };
    render = () => {


        return <View style={this.styles.container}>
            {this.state.processing && <Image source={require("./components/imags/processing.jpg")} />}
            {!this.state.processing && <RNCamera
                ref={(ref) => {
                    this.camera = ref;
                }}
                style={this.styles.preview}
                type={RNCamera.Constants.Type.front}
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
            />}
            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity onPress={this.takePicture.bind(this)} style={this.styles.capture}>
                    <Text style={{ fontSize: 14 }}> SNAP </Text>
                </TouchableOpacity>
            </View>
        </View>
    }
}


function ImageTaker({ navigation }) {


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
        },
        btnBackground: {
            backgroundColor: "orange",
            color: "black",
            padding: 10,

        }
    });

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ImageBackground source={require("./components/imags/back.jpg")} style={styles.image}>
                {/* <Text style={styles.text}>Inside</Text> */}
                <TouchableOpacity onPress={() => {
                    navigation.navigate('TakePicture');
                }} style={styles.btnBackground}>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Scan Person</Text>
                </TouchableOpacity>
            </ImageBackground >
        </View >
    );
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
        },
        btnBackground: {
            backgroundColor: "orange",
            color: "black",
            padding: 10,

        }
    });

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ImageBackground source={require("./components/imags/back.jpg")} style={styles.image}>
                {/* <Text style={styles.text}>Inside</Text> */}
                <TouchableOpacity onPress={() => {
                    navigation.navigate('Login');
                }} style={styles.btnBackground}>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Login</Text>
                </TouchableOpacity>
            </ImageBackground >
        </View >
    );
}


const Stack = createStackNavigator();


const Login = (props) => {
    const [email, setEmail] = useState("b@b.com");
    const [password, setPassword] = useState("1234");

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
        },

        image: {
            marginBottom: 40,
        },

        inputView: {
            backgroundColor: "#FFC0CB",
            borderRadius: 30,
            width: "70%",
            height: 45,
            marginBottom: 20,

            alignItems: "center",
        },

        TextInput: {
            height: 50,
            flex: 1,
            padding: 10,
            marginLeft: 20,
        },

        forgot_button: {
            height: 30,
            marginBottom: 30,
        },

        loginBtn: {
            width: "80%",
            borderRadius: 25,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 40,
            backgroundColor: "orange",
        },
    });

    doLogin = () => {

        axios.post(targetAPI + '/login', { email, password }).then((resp) => {

            if (resp.data.success) {

                // alert(resp.data._id)
                AsyncStorage.setItem('userID', resp.data._id);

                props.navigation.navigate('Dashboard');
            } else {
                alert("Invalid User");
            }

        }).catch((e) => {
            console.log(e);
            alert('Unkown error');
        });

    }

    return (
        <View style={styles.container}>

            <StatusBar style="auto" />
            <View style={styles.inputView}>
                <TextInput
                    value-="ahmed@gmail.com"
                    style={styles.TextInput}
                    placeholder="Email."
                    placeholderTextColor="#003f5c"
                    onChangeText={(email) => setEmail(email)}
                />
            </View>

            <View style={styles.inputView}>
                <TextInput
                    value-="1234567"
                    style={styles.TextInput}
                    placeholder="Password."
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
            </View>
            {/* 
      <TouchableOpacity>
        <Text style={styles.forgot_button}>Forgot Password?</Text>
      </TouchableOpacity> */}

            <TouchableOpacity style={styles.loginBtn} onPress={doLogin}>
                <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
        </View >
    );
}


const App = () => {
    return (
        <>
            <NavigationContainer>
                <Stack.Navigator headerMode='none' screenOptions={{
                    headerMode: 'none'
                }}>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Dashboard" component={Dashboard} />
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="TakePicture" component={TakePictureScreen} />
                    <Stack.Screen name="ImageTaker" component={ImageTaker} />
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

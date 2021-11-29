import React, { Component } from "react";
import { StyleSheet, Text, View, Switch, SafeAreaView, 
Platform, StatusBar,  } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import firebase from "firebase";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf"),
};

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      isEnabled: false,
      lightTheme: true,
      profileImage: "",
      name: "",
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  async fetchUser() {
    let theme, name, image;
    await firebase
      .database()  
      .ref("users/" + firebase.auth().currentUser.uid)
      .once("value", function (snapshot) {
        (theme = snapshot.val().current_theme),
          (name = `${snapshot.val().first_name} ${snapshot.val().last_name}`),
          (image = snapshot.val().profile_picture);
      });
    this.setState({
      lightTheme: theme === "light" ? true : false,
      isEnabled: theme === "light" ? true : false,
      name: name,
      profileImage: image,
    });
  }

  toggleSwitch = () => {
    const previousState = this.state.isEnabled;
    const theme = !this.state.isEnabled ? "light" : "dark";
    var updates = {};
    updates["users/" + firebase.auth().currentUser.uid + "/current_theme"] =
      theme;
    firebase.database().ref().update(updates);
    this.setState({ isEnabled: !previousState, lightTheme: !previousState });
  };

  componentDidMount() {
    this._loadFontsAsync();
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View style={this.state.lightTheme ? styles.containerLight: styles.container}>
          <SafeAreaView style={styles.droidSafeArea}>
            <View style={styles.appTitle}>
              <View style={styles.appIcon}>
                <Image source={require("../assets/logo.png")} style={styles.iconImage}/>
              </View>
              <View style={styles.appTitleTextContainer}>
                <Text style={this.state.lightTheme ? styles.appTitleTextLight : styles.appTitleText}>Story Telling App</Text>
              </View>
            </View> 
            <View style={styles.screenContainer}>
              <View style={styles.profileImageContainer}>
                <Image source={{uri: this.state.profileImage}} style={styles.profileImage}/>
                <Text style={this.state.lightTheme ? styles.nameTextLight : styles.nameText}>{this.state.name}</Text>
              </View>
              <View style={styles.themeContainer}>
                <Text style={this.state.lightTheme ? styles.themeTextLight : styles.themeText}>dark theme</Text>
                <Switch style={{transform: [{
                  scaleX: 1.3,
                }, {
                  scaleY: 1.3,
                }]}} thumbColor = {this.state.isEnabled ? " #ff8c00" : "#006400"} onValueChange={() => {
                  this.toggleSwitch();
                }} value={this.state.isEnabled}></Switch>
              </View>
            </View>
          </SafeAreaView>
        </View>
      );
    }
  }
}



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#15193c" },
  containerLight: { flex: 1, backgroundColor: "white" },
  droidSafeArea: {
    marginTop:
      Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35),
  },
  appTitle: { flex: 0.07, flexDirection: "row" },
  appIcon: { flex: 0.3, justifyContent: "center", alignItems: "center" },
  iconImage: { width: "100%", height: "100%", resizeMode: "contain" },
  appTitleTextContainer: { flex: 0.7, justifyContent: "center" },
  appTitleText: {
    color: "white",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans",
  },
  appTitleTextLight: {
    color: "black",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans",
  },
  screenContainer: { flex: 0.85 },
  profileImageContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: RFValue(140),
    height: RFValue(140),
    borderRadius: RFValue(70),
  },
  nameText: {
    color: "white",
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans",
    marginTop: RFValue(10),
  },
  nameTextLight: {
    color: "black",
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans",
    marginTop: RFValue(10),
  },
  themeContainer: {
    flex: 0.2,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: RFValue(20),
  },
  themeText: {
    color: "white",
    fontSize: RFValue(30),
    fontFamily: "Bubblegum-Sans",
    marginRight: RFValue(15),
  },
  themeTextLight: {
    color: "black",
    fontSize: RFValue(30),
    fontFamily: "Bubblegum-Sans",
    marginRight: RFValue(15),
  },
});

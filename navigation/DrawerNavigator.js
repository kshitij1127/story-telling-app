import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import StackNavigator from "./StackNavigator";
import Profile from "../screens/Profile";
import Logout from "../screens/Logout";

import firebase from "firebase";
import CustomSideBarMenu from "../screens/CustomSideBarMenu"

const Drawer = createDrawerNavigator();

export default class DrawerNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lightTheme: true,
    };
  }

  componentDidMount() {
    let theme;
    firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .once("value", function (snapshot) {
        theme = snapshot.val().current_theme;
      });
    this.setState({
      lightTheme: theme === "light" ? true : false,
    });
  }

  render() {
    return (
      <Drawer.Navigator drawerContentOptions={{
        activeTintColor: this.state.lightTheme ? "green" : "orange",
        inactiveTintColor: this.state.lightTheme ? "blue" : "red",
        itemStyle: {
          marginVertical: 5,
        }
      }} drawerContent={(props) => {
        <CustomSideBarMenu {...props} />
      }}>
        <Drawer.Screen
          name="Home"
          component={StackNavigator}
          options={{
            unmountOnBlur: true,
          }}
        />
        <Drawer.Screen
          name="Profile"
          component={Profile}
          options={{
            unmountOnBlur: true,
          }}
        />
        <Drawer.Screen
          name="Logout"
          component={Logout}
          options={{
            unmountOnBlur: true,
          }}
        />
      </Drawer.Navigator>
    );
  }
}

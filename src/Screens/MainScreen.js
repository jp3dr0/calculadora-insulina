import React from "react";

import { Text, View, StyleSheet } from "react-native";

import { Button, Divider } from "react-native-material-ui";

import { material } from "react-native-typography";

export default class MainScreen extends React.Component {
  static navigationOptions = {
    title: "Calculadora de Insulina"
  };

  navigateToScreen = route => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
      params
    });
    this.props.navigation.dispatch(navigateAction);
  };

  componentDidMount() {
    //console.log(this.props);
  }

  render() {
    return (
      <View style={style.container}>
        <Text
          style={[
            material.titleObject,
            {
              textAlign: "center",
              marginBottom: 20
            }
          ]}>
          Escolha o tipo de cálculo que deseja fazer.
        </Text>
        <Divider />
        <Button
          raised
          primary
          text="Correção"
          onPress={() => {
            this.props.navigation.navigate("Correcao");
          }}
        />
        <View style={{ height: 15, width: "100%" }} />
        <Button
          raised
          primary
          text="Bolos Alimentar"
          onPress={() => {
            this.props.navigation.navigate("Bolos");
          }}
        />
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16
  }
});

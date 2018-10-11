import React from "react";
import { Image, View } from "react-native";
import { Asset, AppLoading } from "expo";
import AppContainer from "./src";

export default class App extends React.Component {
  state = {
    isReady: false
  };

  render() {
    /*
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={() => {
            console.log("ok");
            this.setState({ isReady: true });
          }}
          onError={err => alert(err.toString())}
        />
      );
    }
    */
    return <AppContainer />;
  }

  async _cacheResourcesAsync() {
    const images = [require("./assets/background.jpg")];

    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    });
    return Promise.all(cacheImages);
  }
}

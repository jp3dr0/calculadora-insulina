import React, { Component } from "react";
import { Linking, Text } from "react-native";
import { Constants, WebBrowser } from "expo";

export default class Anchor extends Component {
  _handlePress = () => {
    Linking.openURL(this.props.href);
    this.props.onPress && this.props.onPress();
  };

  _handlePressModal = () => {
    WebBrowser.openBrowserAsync(this.props.href);
  };

  render() {
    return (
      <Text
        {...this.props}
        onPress={this.props.modal ? this._handlePressModal : this._handlePress}
      >
        {this.props.children}
      </Text>
    );
  }
}

// <Anchor href="https://google.com">Go to Google</Anchor>
// <Anchor href="mailto://support@expo.io" modal>Email support</Anchor>

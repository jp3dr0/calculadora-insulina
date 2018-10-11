import React from "react";

import { Button, IconToggle, Icon } from "react-native-material-ui";
import { TextField } from "react-native-material-textfield";
import {
  View,
  TouchableNativeFeedback,
  TextInput,
  ToastAndroid,
  ActivityIndicator
} from "react-native";

import DateTimePicker from "react-native-modal-datetime-picker";
import Container from "../Themes/Container";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

// date-range
//
export default (datePicker = props => {
  return props.loading ? (
    <ActivityIndicator size="small" color="#7edaff" />
  ) : (
    <TouchableNativeFeedback {...props}>
      <View>
        <TextField
          //style={{ flex: 1, width: "100%", width: "100%" }}
          //labelFontSize={14}
          //fontSize={18}
          textColor={"#787878"}
          baseColor={"#787878"}
          disabled
          tintColor={"#787878"}
          //tintColor={"#1D1D1D"}
          autoCapitalize="none"
          autoCorrect={false}
          enablesReturnKeyAutomatically={true}
          returnKeyType="done"
          //error={errors.password}
          //title='Choose wisely'
          maxLength={30}
          renderAccessory={() => (
            <MaterialIcon
              size={24}
              name={"today"}
              color={"#787878"}
              //onPress={this.onAccessoryPress}
              //suppressHighlighting
            />
          )}
          {...props}
        />

        <DateTimePicker
          //onConfirm={() => {}}
          cancelTextIOS="Cancelar"
          confirmTextIOS="Confirmar"
          {...props}
        />
      </View>
    </TouchableNativeFeedback>
  );
});

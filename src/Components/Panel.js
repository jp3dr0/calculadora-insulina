import React from "react";

import {
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  Animated,
  TouchableNativeFeedback,
  Platform,
  Easing
} from "react-native"; //Step 1

import { Icon, Card } from "react-native-material-ui";

/*
<Panel title="A Panel with short content text">
    <Text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </Text>
</Panel>
*/

class Panel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      //Step 3
      title: props.title,
      //expanded: true,
      expanded: this.props.startHidden ? false : true,
      animation: new Animated.Value(),
      maxHeightArray: [],
      spinValue: new Animated.Value(0),
      doingAnimation: false
    };
  }

  _setMaxHeight(event) {
    //console.log("max height", event.nativeEvent.layout.height);
    this.setState({
      maxHeight: event.nativeEvent.layout.height,
      maxHeightArray: [
        ...this.state.maxHeightArray,
        event.nativeEvent.layout.height
      ]
    });
  }

  _setMinHeight(event) {
    this.setState({
      minHeight: event.nativeEvent.layout.height
    });
  }

  toggle = () => {
    // calculando tamanho do conteudo
    // se o conteudo for uma lista (tamanho dinamico) vai pegar a maior altura registrada no array
    // se for conteudo de tamanho fixo, apenas diz a altura do conteudo
    const currentMaxHeight = this.props.list
      ? Math.max.apply(Math, this.state.maxHeightArray)
      : this.state.maxHeight;

    console.log(
      "current max height - altura do conteudo do panel",
      currentMaxHeight
    );

    let initialValue = this.state.expanded
        ? currentMaxHeight + this.state.minHeight
        : this.state.minHeight,
      finalValue = this.state.expanded
        ? this.state.minHeight
        : currentMaxHeight + this.state.minHeight;

    console.log(
      "initial value - altura total do panel expandido",
      initialValue
    );
    console.log("final value - altura total do panel escondido", finalValue);

    //if we use !this.state.expanded i don't know how it wont changes at first
    if (this.state.expanded === true) {
      return this.setState({ expanded: false });
    } else {
      return this.setState({ expanded: true });
    }
    this.setState({ doingAnimation: true });
    Animated.timing(this.state.spinValue, {
      toValue: this.state.expanded ? 0 : 1,
      duration: 150,
      easing: Easing.linear,
      useNativeDriver: true
    }).start(() => {
      // dizendo que agora o panel esta expandido

      //this.setState({expanded: !this.state.expanded});

      // animação de mola do panel abrindo
      this.state.animation.setValue(initialValue);
      Animated.spring(
        //Step 4
        this.state.animation,
        {
          toValue: finalValue
          //useNativeDriver: Platform.OS === "android"
          //useNativeDriver: true // <-- Add this
        }
      ).start(() => {
        this.setState({ doingAnimation: false });
      });
    });

    /*
    let finalValue = this.state.expanded
        ? this.state.maxHeight + this.state.minHeight
        : this.state.minHeight,
      initialValue = this.state.expanded
        ? this.state.minHeight
        : this.state.maxHeight + this.state.minHeight;
    //step 2, this needed, if we use !this.state.expanded i don't know how it wont changes at first

    if (this.state.expanded === true) {
      return this.setState({ expanded: false });
    } else {
      return this.setState({ expanded: true });
    }

    this.state.animation.setValue(initialValue);
    Animated.spring(this.state.animation, { toValue: finalValue }).start();
    */
  };

  animateButton = () => {
    this.setState({ doingAnimation: true });
    Animated.timing(this.state.spinValue, {
      toValue: this.state.expanded ? 0 : 1,
      duration: 120,
      easing: Easing.linear,
      useNativeDriver: true
    }).start(() => {
      this.setState({ doingAnimation: false });

      if (this.state.expanded === true) {
        return this.setState({ expanded: false });
      } else {
        return this.setState({ expanded: true });
      }

      //this.toggle();
    });
  };

  /*
  {this.state.expanded && (
            <View style={styles.body} onLayout={this._setMaxHeight.bind(this)}>
              {this.props.children}
            </View>
          )}
          */

  render() {
    // Second interpolate beginning and end values (in this case 0 and 1)
    const spin = this.state.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "180deg"]
    });

    //console.log(this.state.spinValue);

    let button = null;

    if (this.props.toggle) {
      button = (
        <Animated.View
          style={{
            transform: [{ rotate: spin }],
            //paddingRight: 15,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Icon color="black" name="arrow-drop-down" />
        </Animated.View>
      );
    }

    const alertSize = this.props.alertSize ? this.props.alertSize : 12;

    let alert = null;

    if (this.props.alertColor) {
      alert = (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: this.props.alertColor,
            width: alertSize,
            height: alertSize,
            borderRadius: alertSize / 2
          }}
        />
      );
    }

    //Step 5
    return (
      <Card style={{ container: styles.container }}>
        <Animated.View
          style={[styles.container, { height: this.state.animation }]}
        >
          <TouchableNativeFeedback
            onLayout={this._setMinHeight.bind(this)}
            onPress={
              !this.state.doingAnimation && this.props.toggle
                ? this.animateButton
                : null
            }
          >
            <View
              style={styles.titleContainer}
              //onLayout={this._setMinHeight.bind(this)}
            >
              {alert}
              <Text style={styles.title}>
                {this.state.title}
                {this.props.secondaryTitle
                  ? "\n" + this.props.secondaryTitle
                  : null}
              </Text>
              {button}
            </View>
          </TouchableNativeFeedback>

          {this.state.expanded && (
            <View style={styles.body} onLayout={this._setMaxHeight.bind(this)}>
              {this.props.children}
            </View>
          )}
        </Animated.View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //backgroundColor: "#fff",
    //margin: 10,
    //overflow: "hidden"
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  title: {
    color: "#2a2f43",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 25
  }
});

export default Panel;

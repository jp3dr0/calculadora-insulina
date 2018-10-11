import React, { Component } from "react";
import { View, Image, Text, StatusBar, Platform } from "react-native";
import { Toolbar } from "react-native-material-ui";
import { Updates } from "expo";
import { NavigationActions } from "react-navigation";
import { DARK_COLOR } from "./colors";

export default class DefaultToolbar extends Component {
  constructor(props) {
    super(props);
    //console.log("toolbar props", props);
  }

  componentDidUpdate() {
    console.log("did update auth toolbar", this.props.scene.index);
  }

  render() {
    // estado da cena atual (tela que está focada no momento)
    const sceneState = this.props.scene.descriptor.state;

    // titulo da cena (passa no navigation options do componente, opcional)
    const sceneTitle = this.props.scene.descriptor.options.title;

    // tipo da toolbar (passa no navigation options do componente, opcional)
    const type =
      this.props.scene.descriptor.options.toolbarType || this.props.toolbarType;

    // testamos se tem o title no navigation options da cena atual, se nao tiver, pega o nome da rota atual
    let title = sceneTitle ? sceneTitle : sceneState.routeName;

    // testamos se no navigation options tem alguma logo para por no lugar do titulo
    if (this.props.scene.descriptor.options.logo) {
      const logo = this.props.scene.descriptor.options.logo;
      title = (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            marginRight: "6%",
            padding: 5
          }}>
          <Image
            source={logo}
            style={{
              width: "100%",
              height: "100%"
              //marginRight: 100
              //marginHorizontal: 5
            }}
            resizeMode="contain"
          />
        </View>
      );
    }

    //console.log("props toolbar", this.props);

    let toolbar = (
      <Toolbar
        {...this.props}
        key="toolbar"
        leftElement={this.props.scene.index > 0 ? "arrow-back" : "menu"}
        onLeftElementPress={() => {
          console.log(this.props);
          //this.props.navigation.goBack();
          if (this.props.scene.index > 0)
            this.props.navigation.dispatch(NavigationActions.back());
        }}
        //onLeftElementPress={() => this.props.navigation.openDrawer()}
        centerElement={title}
        onPress={() =>
          Updates.checkForUpdateAsync()
            .then(update =>
              alert(
                "is available: " +
                  update.isAvailable.toString() +
                  "\n" +
                  JSON.stringify(update)
              )
            )
            .catch(err => alert(JSON.stringify(err)))
        }
      />
    );

    if (type) {
      //console.log("toolbar type", type);
      switch (type) {
        case "pesquisa":
          toolbar = (
            <Toolbar
              {...this.props}
              key="toolbar"
              leftElement="menu"
              onLeftElementPress={() => this.props.navigation.openDrawer()}
              centerElement={title}
              searchable={{
                autoFocus: true,
                placeholder: "Pesquisar",
                onChangeText: value => this.setState({ searchText: value }),
                onSearchClosed: () => this.setState({ searchText: "" })
              }}
            />
          );
          break;
        case "noticias":
          toolbar = (
            <Toolbar
              {...this.props}
              key="toolbar"
              leftElement="menu"
              //onLeftElementPress={() => this.props.navigation.pop()}
              onLeftElementPress={() => this.props.navigation.openDrawer()}
              centerElement={title}
              /*
              rightElement={this.props.gridOn ? "grid-off" : "grid-on"}
              onRightElementPress={() => {
                if (this.props.gridOn) {
                  console.log("set grid off");
                  this.props.setGridOff();
                } else {
                  console.log("set grid on");
                  this.props.setGridOn();
                }
              }}
              */
            />
          );
        default:
          break;
      }
    }

    let statusBar = null;
    if (
      this.props.statusBar ||
      (this.props.scene.descriptor.options.statusBar &&
        Platform.OS === "android")
    ) {
      statusBar = (
        <View>
          <StatusBar backgroundColor={DARK_COLOR} translucent />
          <View style={{ backgroundColor: DARK_COLOR, height: 24 }} />
        </View>
      );
    }
    return (
      <View>
        {statusBar}
        {toolbar}
      </View>
    );
  }
}

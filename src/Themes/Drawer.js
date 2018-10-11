import React, { Component } from "react";
import { View, StyleSheet, Text, ImageBackground, Image } from "react-native";
import { NavigationActions } from "react-navigation";
import { Divider, Drawer } from "react-native-material-ui";
import Expo from "expo";
import { authLogout, authGetPermissoes } from "../Store/Actions";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 260,
    elevation: 4,
    backgroundColor: "white"
  },
  avatarLogo: {
    marginTop: 15,
    width: "100%",
    height: "80%"
  }
});

export default class DefaultDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentItem: "Notícias",
      //currentItem: "Escalas",
      nome: "",
      email: "",
      drawerRouteItems: [
        {
          //icon: "new-releases",
          icon: "view-list",
          value: "Notícias",
          onPress: this.navigateToScreen("Notícias", "Notícias da CODERN")
        }
      ]
    };
    Expo.SecureStore.getItemAsync("nome")
      .then(nome => {
        console.log("nome do secure store", nome);
        this.setState({ nome });
      })
      .catch(err => console.log(err));

    Expo.SecureStore.getItemAsync("usuario")
      .then(email => {
        console.log("email do secure store", email);
        this.setState({ email });
      })
      .catch(err => console.log(err));

    this.props.getPermissoes().then(permissoes => {
      console.log("permissoes", permissoes);
      this.setState({
        drawerRouteItems: this.getDrawerItens(permissoes)
      });
    });
  }

  componentDidMount() {}

  getDrawerItens = permissoes => {
    let drawerRouteItems = this.state.drawerRouteItems;
    permissoes.forEach(permissao => {
      console.log(permissao.permissao_entidade_id);
      if (permissao.listar) {
        //console.log(permissao.permissao_entidade_id);
        switch (permissao.permissao_entidade_id) {
          case 73:
            drawerRouteItems.push({
              icon: "timeline",
              value: "Escalas",
              onPress: this.navigateToScreen("Escalas", "Minhas Escalas")
            });
            break;
          case 30:
            drawerRouteItems.push({
              icon: "schedule",
              value: "Apontamentos",
              onPress: this.navigateToScreen(
                "Apontamentos",
                "Consulta de Apontamentos"
              )
            });
            break;
          case 8:
            drawerRouteItems.push({
              icon: "attach-money",
              value: "Contra Cheque",
              onPress: this.navigateToScreen(
                "ContraCheque",
                "Consulta de Contra Cheque"
              )
            });
            break;
          default:
            break;
        }
      }
    });
    console.log(drawerRouteItems);
    /*
    drawerRouteItems.forEach(item => {
      console.log(item.value);
    });
    */

    return drawerRouteItems;
  };

  navigateToScreen = (route, name) => () => {
    console.log("navigate to screen");
    console.log("drawer props", this.props);
    params = { navName: name ? name : null };
    console.log("params", params);
    this.setState({
      currentItem: route
    });

    const navigateAction = NavigationActions.navigate({
      routeName: route,
      params
    });
    this.props.navigation.dispatch(navigateAction);
  };

  handleLogout() {
    this.props
      .logout()
      .then(response => {
        console.log(response);
        this.props.navigation.navigate("AuthLoading");
      })
      .catch(err => alert("não foi possivel voltar para a tela de login"));
  }

  render() {
    const nome = this.state.nome ? this.state.nome : "nome do usuario";
    const email = this.state.email ? this.state.email : "email do usuario";
    //console.log(nome, email);

    console.log("item ativo na drawer: " + this.state.currentItem);
    //console.log(this.state.drawerRouteItems);

    let items = [];

    this.state.drawerRouteItems.forEach(item => {
      //console.log(item.value);
      //console.log(item.value.replace(/\s+/g, ""));
      //console.log(this.state.currentItem);
      item.active = item.value.replace(/\s+/g, "") === this.state.currentItem;
      items.push(item);
    });

    return (
      <Drawer>
        <View style={{ backgroundColor: "#3FA9F5", height: 24 }} />
        <Drawer.Header
          style={{
            container: {
              //backgroundColor: "#3FA9F5"
            },
            contentContainer: {
              //color: "white"
            }
          }}
          image={
            (type = (
              <Image
                source={headerBackground}
                style={{
                  width: "100%",
                  height: "100%",
                  //backgroundColor: "#3fa9f5",
                  backgroundColor: "rgba(0, 0, 0, .5)"
                }}
              />
            ))
          }
          backgroundColor="#3FA9F5">
          <Drawer.Header.Account
            avatar={<View />}
            footer={{
              dense: true,
              centerElement: {
                primaryText: nome,
                secondaryText: email
              },
              style: {
                textViewContainer: {
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, .5)"
                },
                primaryText: {
                  color: "white"
                }
              }
              //rightElement: "arrow-drop-down"
            }}
          />
        </Drawer.Header>
        <Drawer.Section divider items={items} />
        <Drawer.Section
          items={[
            {
              icon: "exit-to-app",
              value: "Sair",
              onPress: () => this.handleLogout(),
              onLongPress: () => alert("Sair do aplicativo")
            }
          ]}
        />
      </Drawer>
    );
  }
}

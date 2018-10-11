import React, { Component } from "react";
import { Font, Asset, Updates } from "expo";
import {
  Alert,
  NativeModules,
  StatusBar,
  View,
  Platform,
  SafeAreaView
} from "react-native";
import RootNavigator from "./Routes/routes";
import {
  COLOR,
  ThemeContext,
  getTheme,
  Toolbar
} from "react-native-material-ui";
import { PRIMARY_COLOR, LIGHT_COLOR } from "./Themes/colors";
const UIManager = NativeModules.UIManager;

const uiTheme = {
  palette: {
    primaryColor: PRIMARY_COLOR,
    accentColor: LIGHT_COLOR
    //primaryTextColor: "#212121",
    //secondaryTextColor: "#5f6368"
  }
};

export default class ThemeContainer extends Component {
  state = {
    fontLoaded: false
  };
  async componentDidMount() {
    await Promise.all([
      Font.loadAsync({
        Roboto: require("../assets/fonts/Roboto-Regular.ttf")
      })
    ]);
    this.setState({ fontLoaded: true });

    // SÓ APARECE O MODAL QUANDO A ATUALIZAÇÃO JÁ ESTIVER BAIXADA (BAIXA AUTOMATICAMENTE SE EXISTIR, SE NÃO EXISTIR NÃO FAZ NADA)

    Updates.checkForUpdateAsync()
      .then(update => {
        //alert("check for update async index: " + JSON.stringify(update));
        // tem atualização
        if (update.isAvailable) {
          Updates.fetchUpdateAsync()
            .then(update => {
              if (update.isNew) {
                Alert.alert(
                  "Atualização Disponível",
                  "Foi baixada uma atualização do aplicativo. Você pode reinciar o aplicativo agora para utilizar a versão mais nova, ou continuar na tela atual, e da próxima vez que ele for iniciado já estará com a versão mais recente.",
                  [
                    { text: "Não Reiniciar", style: "cancel" },
                    {
                      text: "Reiniciar",
                      onPress: () => Updates.reloadFromCache()
                    },
                    { cancelable: false }
                  ]
                );
              }
              //alert("fetch update async: " + JSON.stringify(update));
            })
            .catch(err =>
              Alert.alert(
                "Erro ao baixar atualização em background",
                err.toString()
              )
            );
        }
      })
      .catch(err =>
        Alert.alert("Erro ao baixar atualização em background", err.toString())
      );

    // APARECE O MODAL SE EXISTIR NOTIFICAÇÃO, E SE O USUARIO CONCORDAR APARECE OUTRA APÓS SER BAIXADO
    // NAO É MUITO UTIL JÁ QUE AS ATUALIZAÇÕES SÃO SUPER RAPIDAS, ENTAO O INTERVALO DE TEMPO ENTRE UM MODAL E OUTRO É MUITO CURTO
    /*
    Updates.checkForUpdateAsync()
      .then(update => {
        //alert("check for update async index: " + JSON.stringify(update));
        // tem atualização
        if (update.isAvailable) {

          Alert.alert(
            "Atualização Disponível",
            "Opa! Existe uma versão mais recente do aplicativo disponível. Você pode continuar utilizando o aplicativo normalmente enquanto estamos baixando a atualização.\n\nDeseja ser notificado quando a atualização for baixada para instalar? Caso não queira, na próxima inicialização do aplicativo ela já estará instalada automaticamente.",
            [
              //{text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
              {
                text: "Não",
                style: "cancel"
              },
              {
                text: "Sim",
                onPress: () => {
                  Updates.fetchUpdateAsync()
                    .then(update => {
                      if (update.isNew) {
                        Alert.alert(
                          "Sucesso",
                          "A atualização foi baixada. Você pode reinciar o aplicativo agora para utilizar a versão mais nova, ou continuar na tela atual, e da próxima vez que ele for iniciado já estará com a versão mais recente.",
                          [
                            { text: "Não Reiniciar", style: "cancel" },
                            {
                              text: "Reiniciar",
                              onPress: () => Updates.reloadFromCache()
                            },
                            { cancelable: false }
                          ]
                        );
                      }
                      //alert("fetch update async: " + JSON.stringify(update));
                    })
                    .catch(err =>
                      alert("Erro ao baixar atualização em background: " + err)
                    );
                }
              }
            ],
            { cancelable: false }
          );
        } else {
          // não tem atualização
          //alert("check for update async index false: " + JSON.stringify(update));
        }
      })
      .catch(err => alert("Erro ao procurar atualizações " + err));
      */
  }

  componentWillMount() {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  render() {
    if (!this.state.fontLoaded) return null;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ThemeContext.Provider value={getTheme(uiTheme)}>
          <RootNavigator />
        </ThemeContext.Provider>
      </SafeAreaView>
    );
  }
}

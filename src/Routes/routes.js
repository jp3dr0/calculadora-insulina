import React from "react";

import {
  createStackNavigator,
  createSwitchNavigator,
  createDrawerNavigator
} from "react-navigation";

import { fromTop } from "react-navigation-transitions";

import MainScreen from "../Screens/MainScreen";
import DefaultToolbar from "../Themes/Toolbar";
import BolosScreen from "../Screens/BolosScreen";
import CorrecaoScreen from "../Screens/CorrecaoScreen";

/*
const AppStack = createDrawerNavigator(
  {
    Notícias: NoticiasStack,
    ContraCheque: ContraChequeStack,
    Apontamentos: ApontamentosStack,
    Escalas: EscalasStack,
    ProgramacaoEmbarque: ProgramacaoEmbarqueStack
  },
  {
    initialRouteName: "Notícias",
    //initialRouteName: "ProgramacaoEmbarque",
    contentComponent: ({ navigation }) => <Drawer navigation={navigation} />,
    drawerWidth: 300
  }
);
*/

const MainStack = createStackNavigator(
  {
    Main: MainScreen,
    Bolos: BolosScreen,
    Correcao: CorrecaoScreen
  },
  {
    navigationOptions: {
      //header: null // Will hide header for all screens of current stack navigator,
      header: props => <DefaultToolbar {...props} statusBar />
    },
    transitionConfig: () => fromTop(800)
  }
);

export default (RootNavigator = createSwitchNavigator(
  {
    App: MainStack
    //AuthLoading: AuthLoadingScreen,
    //Auth: AuthStack
  },
  {
    initialRouteName: "App",
    navigationOptions: {
      header: null
    }
  }
));

import React from "react";

import { Text, View, StyleSheet, Keyboard } from "react-native";

import { Button, Divider } from "react-native-material-ui";

import { material } from "react-native-typography";

import { TextField } from "react-native-material-textfield";
import { DARK_COLOR, LIGHT_COLOR, PRIMARY_COLOR } from "../Themes/colors";

import * as Animatable from "react-native-animatable";

export default class CorrecaoScreen extends React.Component {
  static navigationOptions = {
    title: "Correção"
  };

  constructor(props) {
    super(props);

    const doseParam = props.navigation.getParam("dose", null);

    this.state = {
      meta: 160,
      correcao: 60,
      valorAtual: null,
      error: {
        meta: false,
        correcao: false,
        valorAtual: false
      },
      dose: null,
      showDose: false,
      doseParam
    };

    // listener teclado

    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {}
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        if (this.state.dose && !this.state.error.valorAtual)
          this.setState({ showDose: true }, () => {
            this.doseAnimate
              //.bounce(800)
              .tada(1000)
              .then(endState =>
                console.log(
                  endState.finished ? "tada finished" : "tada cancelled"
                )
              );
          });
      }
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  calcular = (meta, correcao, valorAtual) => {
    const diferenca = valorAtual - meta;
    if (diferenca > 0) {
      const dose = diferenca / correcao;
      //return dose;
      return Math.round(dose * 10) / 10;
    } else {
      return null;
    }
  };

  stringToNumber = value =>
    value && typeof value === "string"
      ? parseFloat(value.replace(",", "."))
      : //.replace(/[^0-9]/g, "")
        null;

  renderTextInput = (value, valueStateName, label) => (
    <TextField
      tintColor={LIGHT_COLOR}
      baseColor={PRIMARY_COLOR}
      keyboardType="numeric"
      label={label}
      value={value ? value.toString() : ""}
      error={
        this.state.error[valueStateName]
          ? "Digite apenas valores positivos"
          : null
      }
      onChangeText={value => {
        //const valueStateName = "valorAtual";

        this.setState(
          prevState => ({
            [valueStateName]: value
          }),
          () => {
            const { valorAtual, meta, correcao } = this.state;

            const converted = valorAtual
              ? this.stringToNumber(valorAtual)
              : null;

            const dose = this.calcular(meta, correcao, converted);
            this.setState(prevState => ({
              dose: dose + prevState.doseParam,
              showDose: prevState.showDose
                ? dose && dose != Infinity && dose >= 0
                : false
            }));
          }
        );
      }}
    />
  );

  render() {
    const debug = (
      <View>
        <Text>
          {"valorAtual - state: " +
            valorAtual +
            "\ntype of: " +
            typeof valorAtual}
        </Text>
        <Text>
          {"valorAtual - converted: " +
            converted +
            "\ntype of: " +
            typeof converted}
        </Text>
      </View>
    );

    //this.setState({ dose: this.calcular(meta, correcao, converted) });

    //const dose = this.calcular(meta, correcao, converted);

    const {
      valorAtual,
      meta,
      correcao,
      dose,
      showDose,
      doseParam
    } = this.state;

    const converted = valorAtual ? this.stringToNumber(valorAtual) : null;

    const doseElement = (
      <View style={style.doseContainer}>
        <Text
          style={[
            material.subheadingObject,
            {
              textAlign: "center",
              marginBottom: 15
            }
          ]}>
          {"Dose (valor decimal)" +
            (doseParam ? ", somada com a dose de bolos: " : ": ") +
            dose +
            (dose > 2 ? " unidades" : " unidade")}
        </Text>
        <Button
          raised
          primary
          text="Somar com Bolos"
          onPress={() => {
            this.props.navigation.navigate("Bolos", {
              teste: "eae",
              dose
            });
          }}
        />
      </View>
    );

    return (
      <View style={style.container}>
        {this.renderTextInput(meta, "meta", "Meta de Glicemia")}
        {this.renderTextInput(correcao, "correcao", "Valor de Correção")}
        {this.renderTextInput(valorAtual, "valorAtual", "Glicemia atual")}
        <Animatable.View
          ref={ref => (this.doseAnimate = ref)}
          animation="tada"
          //style={styles.inputContainer}
          delay={200}
          duration={1700}>
          {showDose ? doseElement : null}
        </Animatable.View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  /*
  container: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  */
  container: {
    margin: 16,
    marginTop: 8
  },
  doseContainer: {
    margin: 64,
    marginTop: 16
  }
});

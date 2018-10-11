import React from "react";
import { Text, View, StyleSheet, Keyboard } from "react-native";
import { Button, Divider } from "react-native-material-ui";
import * as Animatable from "react-native-animatable";
import { material } from "react-native-typography";
import { TextField } from "react-native-material-textfield";
import { Dropdown } from "react-native-material-dropdown";
import { LIGHT_COLOR, PRIMARY_COLOR } from "../Themes/colors";

export default class BolosScreen extends React.Component {
  static navigationOptions = {
    title: "Bolos"
  };

  constructor(props) {
    super(props);

    const doseParam = props.navigation.getParam("dose", null);

    this.state = {
      refeicoes: [
        { value: 10, label: "Almoço" },
        { value: 15, label: "Café e Lanche" },
        { value: 20, label: "Lanche da Tarde/Jantar" },
        { value: 30, label: "11h" }
      ],
      valorAtual: null,
      refeicaoAtual: 15,
      doseParam,
      dose: null,
      showDose: false,
      error: false
    };

    // listener teclado

    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {}
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        if (this.state.dose && !this.state.error)
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

  calcular = (valor, refeicao) =>
    valor && valor > 0 ? Math.round((valor / refeicao) * 10) / 10 : null;

  stringToNumber = value =>
    value && typeof value === "string"
      ? parseFloat(value.replace(",", "."))
      : //.replace(/[^0-9]/g, "")
        null;

  render() {
    const { refeicaoAtual, doseParam, dose, valorAtual, showDose } = this.state;

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
            (doseParam ? ", somada com a dose de correção: " : ": ") +
            dose +
            (dose > 2 ? " unidades" : " unidade")}
        </Text>
        <Button
          raised
          primary
          text="Somar com Correção"
          onPress={() => {
            this.props.navigation.navigate("Correcao", {
              dose
            });
          }}
        />
      </View>
    );

    return (
      <View style={style.container}>
        <Dropdown
          baseColor="red"
          showsVerticalScrollIndicator
          key="refeicaoSelect"
          value={refeicaoAtual}
          label="Selecione a Refeição"
          onChangeText={refeicaoAtual => {
            this.setState(
              {
                refeicaoAtual
              },
              () => {
                const { valorAtual, refeicaoAtual } = this.state;

                const converted = valorAtual
                  ? this.stringToNumber(valorAtual)
                  : null;

                const dose = this.calcular(converted, refeicaoAtual);
                this.setState(
                  prevState => ({
                    dose: dose + prevState.doseParam,
                    showDose: prevState.showDose
                      ? dose && dose != Infinity && dose >= 0
                      : false
                  }),
                  () => {
                    this.doseAnimate
                      //.bounce(800)
                      .tada(1000)
                      .then(endState =>
                        console.log(
                          endState.finished ? "tada finished" : "tada cancelled"
                        )
                      );
                  }
                );
              }
            );
          }}
          data={this.state.refeicoes}
        />

        <TextField
          tintColor={LIGHT_COLOR}
          baseColor={PRIMARY_COLOR}
          keyboardType="numeric"
          label="Peso do Alimento (g)"
          value={valorAtual ? valorAtual.toString() : ""}
          error={this.state.error ? "Digite apenas valores positivos" : null}
          onChangeText={valorAtual => {
            this.setState(
              {
                valorAtual
              },
              () => {
                const { valorAtual, refeicaoAtual } = this.state;

                const converted = valorAtual
                  ? this.stringToNumber(valorAtual)
                  : null;

                const dose = this.calcular(converted, refeicaoAtual);
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
  container: {
    flex: 1,
    marginHorizontal: 16
  },
  doseContainer: {
    margin: 64,
    marginTop: 16
  }
});

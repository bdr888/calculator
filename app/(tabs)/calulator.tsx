import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

// all button values, organized in display rows
const buttons: string[][] = [
  ["AC", "+/-", "%", "/"],
  ["7", "8", "9", "X"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["0", ".", "="],
];

type Operator = "/" | "X" | "-" | "+";
const operators: Set<Operator> = new Set(["/", "X", "-", "+"]);

export default function Calculator() {
  const [display, setDisplay] = useState<string>("0");
  const [firstValue, setFirstValue] = useState<string | null>(null);
  const [secondValue, setSecondValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [result, setResult] = useState<string | null>(null);

  // updates display - what the user sees. Either firstValue, secondValue, or result
  useEffect(() => {
    if (result !== null) {
      setDisplay(result.toString());
    } else if (secondValue !== null) {
      setDisplay(secondValue.toString());
    } else if (firstValue !== null) {
      setDisplay(firstValue.toString());
    }
  }, [firstValue, secondValue, result]);

  // set first or second values on input of integer
  function handleInteger(value: string) {
    if (operator === null) {
      setFirstValue((prev) => (prev === null ? value : prev + value));
    } else {
      setSecondValue((prev) => (prev === null ? value : prev + value));
    }
  }

  function handleOperator(value: Operator) {
    setOperator(value);
  }

  // do the math and set the result
  function handleSubmit() {
    if (firstValue !== null && secondValue !== null && operator !== null) {
      let result = 0;
      const num1 = parseFloat(firstValue);
      const num2 = parseFloat(secondValue);

      switch (operator) {
        case "/":
          result = num1 / num2;
          break;
        case "X":
          result = num1 * num2;
          break;
        case "-":
          result = num1 - num2;
          break;
        case "+":
          result = num1 + num2;
          break;
        default:
          return;
      }
      setResult(result.toString());
    }
  }

  function handleClear() {
    setDisplay("0");
    setResult(null);
    setOperator(null);
    setFirstValue(null);
    setSecondValue(null);
  }

  // onPress handler for all buttons
  function handleAllInput(input: string) {
    if (input === "AC") {
      handleClear();
    } else if (input === "+/-") {
      // to do handle negative
      handleClear();
    } else if (input === "%") {
      // to do handle percentage
      handleClear();
    } else if (operators.has(input as Operator)) {
      handleOperator(input as Operator);
    } else if (input === "=") {
      handleSubmit();
    } else {
      handleInteger(input);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.resultContainer}>
        <Text style={styles.displayText}>{display}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  operators.has(button as Operator)
                    ? styles.orangeButton
                    : null,
                  button === "AC" || button === "+/-" || button === "%"
                    ? styles.grayButton
                    : null,
                  button === "0" ? styles.zeroButton : null,
                ]}
                onPress={() => handleAllInput(button)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    button === "AC" || button === "+/-" || button === "%"
                      ? styles.grayButtonText
                      : null,
                  ]}
                >
                  {button}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 80,
    backgroundColor: "black",
  },
  resultContainer: {
    flex: 2,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "90%",
  },
  displayText: {
    color: "white",
    fontSize: 80,
  },
  buttonsContainer: {
    flex: 5,
    width: "100%",
    padding: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#333333",
    flex: 1,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    margin: 5,
  },
  zeroButton: {
    flex: 1, // Make the zero button twice as wide
    alignItems: "flex-start",
    paddingLeft: 40,
  },
  orangeButton: {
    backgroundColor: "#ff9500",
  },
  grayButton: {
    backgroundColor: "gray",
  },
  buttonText: {
    color: "white",
    fontSize: 30,
  },
  grayButtonText: {
    color: "black",
    fontSize: 30,
  },
});

// Other considerations/approaches:
// 1. format buttons data by integers and operators to separate concern of data/display order
// 2. Just use firstValue and display and no need for useEffect for less code, but a little less immediately understandable
// 3. Componetize button
// 4. Grid vs flex
// 5. Styles - pass in props to style instead of inline style switching

// @TODOs:
// 1. Round result to handle long results
// 2. Indicate active operator button with background color
// 3. Percentage button
// 4. Negative button
// 5. Fix zero button width
// 6. % font or icon style
// 7. use toFixed() with result?
// 8. handle when input operator before first input

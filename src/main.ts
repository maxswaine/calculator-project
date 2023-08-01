import "./main.scss";

// Constants and variables
const buttons = document.querySelectorAll<HTMLButtonElement>(
  ".calculator__input-button"
);
const outputScreen = document.querySelector<HTMLElement>(
  ".calculator__output-placeholder"
);
const outputSum = document.querySelector<HTMLDivElement>(
  ".calculator__output-sum"
);

const lightModeButton = document.querySelector<HTMLImageElement>(
  ".calculator__mode-button--light-mode"
);
const darkModeButton = document.querySelector<HTMLImageElement>(
  ".calculator__mode-button--dark-mode"
);
const calculator = document.querySelector<HTMLElement>("body");

let numbers: number[] = [];
let operators: string[] = [];

if (!buttons) {
  throw new Error("issue with the buttons");
}
if (!outputScreen || !outputSum) {
  throw new Error("Issue with output");
}

if (!lightModeButton || !darkModeButton || !calculator) {
  throw new Error("Issue with theme toggle");
}

//Regex Key:
// Checks for conditional minus sign
// After that it looks through to find one or more digits
// Check for optional decimal point, followed by one or more digits
// Separates with | and then finds the operators
//global flag
const operatorRegex = /(-?\d+(\.\d+)?|[+x/\-])/g;
let isFirstButtonPress: boolean = true;

// Function to handle the AC button
const handleACButton = () => {
  outputScreen.innerText = "0";
  outputSum.innerText = "0";
  isFirstButtonPress = true;
};

const calculateSum = (input: string) => {
  const parts = input.match(operatorRegex);

  if (!parts) {
    throw new Error("Operator error");
  }

  numbers = parts
    .filter((part) => !isNaN(parseFloat(part))) // Filter out operators
    .map((part) => parseFloat(part)); // Map all the non-operators to a new array

  operators = parts.filter((part) => isNaN(parseFloat(part))); //Keeps only the operators

  let result = numbers[0];

  //Iterate through the array to see what functions need to be done.
  operators.forEach((operator, i) => {
    switch (operator) {
      case "+":
        result += numbers[i + 1];
        break;
      case "-":
        result -= numbers[i + 1];
        break;
      case "x":
        result *= numbers[i + 1];
        break;
      case "/":
        result /= numbers[i + 1];
        break;
      default:
        break;
    }
  });
  return result;
};

// Function to handle digit buttons
const handleDigitButton = (button: HTMLButtonElement) => {
  let digit = button.innerText;
  //If the button has not been pressed, it will replace the text with the first value that has been pressed
  if (isFirstButtonPress) {
    outputScreen.innerText = digit;
    isFirstButtonPress = false;
  }
  //Starts adding the rest of the values whilst keeping the ones before.
  else {
    let currentContent = outputScreen.innerText;
    currentContent += digit;
    outputScreen.innerText = currentContent;
  }
};

// Function to handle the equals button
const handleEqualsButton = () => {
  let sum: string = outputScreen.innerText;
  outputSum.innerText = sum;
  const result = calculateSum(sum);
  outputScreen.innerText = result.toString();
  isFirstButtonPress = false;
};

// Function to handle the undo button using slice to remove the last item from string array
const handleUndoButton = () => {
  let currentContent = outputScreen.innerText;
  if (currentContent.length > 0) {
    currentContent = currentContent.slice(0, -1);
    outputScreen.innerText = currentContent;
  }
};

// Equivalent of pressing equals and then dividing by 100.
const handlePercentageButton = () => {
  handleEqualsButton();
  const result = parseFloat(outputScreen.innerText) / 100;
  if (result >= 0) {
    outputScreen.innerText = result.toString();
  } else {
    outputScreen.innerText = "Error";
    throw new Error("Cannot have negative percentage");
  }
};

const handleMinusButton = () => {
  let currentContent = outputScreen.innerText;
  if (currentContent !== "0") {
    if (currentContent[0] === "-") {
      currentContent = currentContent.slice(1);
    } else {
      currentContent = `-${currentContent}`;
    }
  }
  outputScreen.innerText = currentContent;
};

// Function to handle button presses
const handleButtonInput = (event: Event) => {
  const button = event.target as HTMLButtonElement;
  let digit: string = button.innerText;

  if (digit === "AC") {
    handleACButton();
  } else if (digit === "=") {
    handleEqualsButton();
  } else if (digit === "⟲") {
    handleUndoButton();
  } else if (digit === "%") {
    handlePercentageButton();
  } else if (digit === "+/-") {
    handleMinusButton();
  } else {
    handleDigitButton(button);
  }
};

const handleThemeToggle = () => {
  calculator.classList.toggle("light-mode");

  // Toggle the visibility of the mode buttons
  if (calculator.classList.contains("light-mode")) {
    // console.log("Switching to light mode");
    lightModeButton.style.display = "none";
    darkModeButton.style.display = "block";
  } else {
    // console.log("Switching to dark mode");

    darkModeButton.style.display = "none";
    lightModeButton.style.display = "block";
  }
};

// Add event listeners to buttons
buttons.forEach((button) => {
  button.addEventListener("click", handleButtonInput);
});

lightModeButton.addEventListener("click", handleThemeToggle);
darkModeButton.addEventListener("click", handleThemeToggle);

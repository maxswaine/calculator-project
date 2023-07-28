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

if (!buttons) {
  throw new Error("issue with the buttons");
}
if (!outputScreen || !outputSum) {
  throw new Error("Issue with output");
}

const operatorRegex = /[x/+-]/;
const numberRegex = /\d/;
let isFirstButtonPress: boolean = true;

// Function to handle the AC button
const handleACButton = () => {
  outputScreen.innerText = "";
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
  //   const result = calculateSum(sum);
  //   outputSum.innerText = result.toString();
  isFirstButtonPress = true;
};

// Function to handle button presses
const handleButtonInput = (event: Event) => {
  const button = event.target as HTMLButtonElement;
  let digit: string = button.innerText;

  if (digit === "AC") {
    handleACButton();
  } else if (numberRegex.test(digit) || operatorRegex.test(digit)) {
    handleDigitButton(button);
  } else if (digit === "=") {
    handleEqualsButton();
  }
};

// Add event listeners to buttons
buttons.forEach((button) => {
  button.addEventListener("click", handleButtonInput);
});

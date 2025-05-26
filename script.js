const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lower = "abcdefghijklmnopqrstuvwxyz";
const digits = "0123456789";
const symbols = "=-/?!";

const lengthInput = document.getElementById("length");
const maxUpperInput = document.getElementById("maxUpper");
const maxDigitsInput = document.getElementById("maxDigits");
const maxLettersInput = document.getElementById("maxLetters");
const errorMessage = document.getElementById("errorMessage");

function adjustLimits() {
  const length = parseInt(lengthInput.value, 10);
  if (isNaN(length) || length < 1) return;

  const useUpper = document.getElementById("useUpper").checked;
  const useLower = document.getElementById("useLower").checked;
  const useDigits = document.getElementById("useDigits").checked;
  const useSymbols = document.getElementById("useSymbols").checked;

  let lettersCount = Math.min(length, Math.round(length * 0.6));
  let upperCount = Math.min(lettersCount, Math.round(length * 0.4));
  let digitsCount = Math.min(length - lettersCount, Math.round(length * 0.4));

  if (!useUpper) upperCount = 0;
  if (!useLower && useUpper) lettersCount = upperCount;
  else if (!useLower && !useUpper) lettersCount = 0;
  if (!useDigits) digitsCount = 0;

  maxLettersInput.value = lettersCount;
  maxUpperInput.value = upperCount;
  maxDigitsInput.value = digitsCount;

  errorMessage.textContent = "";
}

function generateToken() {
  const length = parseInt(lengthInput.value, 10);
  if (isNaN(length) || length < 1) {
    errorMessage.textContent = "Введите корректную длину.";
    return;
  }

  const useUpper = document.getElementById("useUpper").checked;
  const useLower = document.getElementById("useLower").checked;
  const useDigits = document.getElementById("useDigits").checked;
  const useSymbols = document.getElementById("useSymbols").checked;

  let maxUpper = parseInt(maxUpperInput.value, 10);
  let maxDigits = parseInt(maxDigitsInput.value, 10);
  let maxLetters = parseInt(maxLettersInput.value, 10);

  if (!useUpper) maxUpper = 0;
  if (!useLower && useUpper) maxLetters = maxUpper;
  else if (!useLower && !useUpper) maxLetters = 0;
  if (!useDigits) maxDigits = 0;

  let charPool = "";
  if (useUpper) charPool += upper;
  if (useLower) charPool += lower;
  if (useDigits) charPool += digits;
  if (useSymbols) charPool += symbols;

  if (charPool.length === 0) {
    errorMessage.textContent = "Нет доступных символов для генерации.";
    document.getElementById("token").textContent = "Ошибка генерации";
    return;
  }

  if (maxLetters + maxDigits > length) {
    maxLetters = Math.min(maxLetters, length);
    maxDigits = Math.min(maxDigits, length - maxLetters);
  }

  let token = "";
  let attempts = 0;

  while (attempts < 2000) {
    let result = "";
    let upperCount = 0, digitCount = 0, letterCount = 0, symbolCount = 0, consecutiveUpper = 0;

    for (let i = 0; i < length; i++) {
      let char = null;
      let tries = 0;

      while (tries < 100) {
        const c = charPool[Math.floor(Math.random() * charPool.length)];

        const isUpper = upper.includes(c);
        const isLower = lower.includes(c);
        const isDigit = digits.includes(c);
        const isSymbol = symbols.includes(c);
        const isLetter = isUpper || isLower;

        if (isUpper && upperCount >= maxUpper) { tries++; continue; }
        if (isDigit && digitCount >= maxDigits) { tries++; continue; }
        if (isLetter && letterCount >= maxLetters) { tries++; continue; }

        if (isSymbol && length <= 5 && symbolCount >= 1) { tries++; continue; }
        if (isSymbol && length > 5 && symbolCount > Math.floor(length / 6)) { tries++; continue; }

        if (isUpper) {
          consecutiveUpper++;
          if (consecutiveUpper > 2) { tries++; continue; }
        } else {
          consecutiveUpper = 0;
        }

        char = c;
        if (isUpper) upperCount++;
        if (isDigit) digitCount++;
        if (isLetter) letterCount++;
        if (isSymbol) symbolCount++;

        break;
      }
      if (!char) break;
      result += char;
    }

    if (result.length === length) {
      const caseMode = document.getElementById("caseMode").value;
      if (caseMode === "lower") result = result.toLowerCase();
      else if (caseMode === "upper") result = result.toUpperCase();
      token = result;
      break;
    }
    attempts++;
  }

  if (!token) {
    errorMessage.textContent = "Ошибка генерации токена, попробуйте изменить настройки.";
    token = "Ошибка генерации";
  } else {
    errorMessage.textContent = "";
  }

  document.getElementById("token").textContent = token;
}

function copyToken() {
  const token = document.getElementById("token").textContent;
  if (token && token !== "Ошибка генерации") {
    navigator.clipboard.writeText(token).then(() => {
      alert("Скопировано в буфер обмена!");
    });
  }
}

window.onload = () => {
  adjustLimits();
  generateToken();

  document.getElementById("generateBtn").addEventListener("click", generateToken);
  document.getElementById("copyBtn").addEventListener("click", copyToken);

  lengthInput.addEventListener("input", () => {
    adjustLimits();
    generateToken();
  });

  document.getElementById("useUpper").addEventListener("change", () => {
    adjustLimits();
    generateToken();
  });
  document.getElementById("useLower").addEventListener("change", () => {
    adjustLimits();
    generateToken();
  });
  document.getElementById("useDigits").addEventListener("change", () => {
    adjustLimits();
    generateToken();
  });
  document.getElementById("useSymbols").addEventListener("change", () => {
    adjustLimits();
    generateToken();
  });

  maxUpperInput.addEventListener("input", generateToken);
  maxDigitsInput.addEventListener("input", generateToken);
  maxLettersInput.addEventListener("input", generateToken);
  document.getElementById("caseMode").addEventListener("change", generateToken);
};

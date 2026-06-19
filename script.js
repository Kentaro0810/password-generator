const passwordOutput = document.getElementById("passwordOutput");
const copyButton = document.getElementById("copyButton");
const generateButton = document.getElementById("generateButton");
const lengthRange = document.getElementById("lengthRange");
const lengthValue = document.getElementById("lengthValue");
const message = document.getElementById("message");

const useUppercase = document.getElementById("useUppercase");
const useLowercase = document.getElementById("useLowercase");
const useNumbers = document.getElementById("useNumbers");
const useSymbols = document.getElementById("useSymbols");
const excludeSimilar = document.getElementById("excludeSimilar");

const strengthText = document.getElementById("strengthText");
const strengthBarFill = document.getElementById("strengthBarFill");

const CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?/|~"
};

const SIMILAR_CHARS = "O0Il1";

/**
 * 暗号学的に安全なランダム整数を作る
 * 0以上max未満の整数を返す
 */
function secureRandomInt(max) {
  if (max <= 0) {
    throw new Error("max must be greater than 0");
  }

  const randomArray = new Uint32Array(1);
  const maxUint32 = 0x100000000;
  const limit = Math.floor(maxUint32 / max) * max;

  let randomValue;

  do {
    crypto.getRandomValues(randomArray);
    randomValue = randomArray[0];
  } while (randomValue >= limit);

  return randomValue % max;
}

function removeSimilarChars(chars) {
  return chars
    .split("")
    .filter((char) => !SIMILAR_CHARS.includes(char))
    .join("");
}

function getSelectedCharSets() {
  const selected = [];

  if (useUppercase.checked) {
    selected.push(CHAR_SETS.uppercase);
  }

  if (useLowercase.checked) {
    selected.push(CHAR_SETS.lowercase);
  }

  if (useNumbers.checked) {
    selected.push(CHAR_SETS.numbers);
  }

  if (useSymbols.checked) {
    selected.push(CHAR_SETS.symbols);
  }

  if (excludeSimilar.checked) {
    return selected
      .map(removeSimilarChars)
      .filter((chars) => chars.length > 0);
  }

  return selected;
}

function pickRandomChar(chars) {
  return chars[secureRandomInt(chars.length)];
}

function shuffleSecurely(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function generatePassword() {
  const length = Number(lengthRange.value);
  const selectedCharSets = getSelectedCharSets();

  if (selectedCharSets.length === 0) {
    passwordOutput.value = "";
    showMessage("最低1つは文字種を選んでください。", true);
    updateStrength(0, 0);
    return;
  }

  const allChars = selectedCharSets.join("");
  const passwordChars = [];

  // 選んだ文字種が必ず最低1文字は入るようにする
  for (const charSet of selectedCharSets) {
    passwordChars.push(pickRandomChar(charSet));
  }

  // 残りの文字をランダムに埋める
  while (passwordChars.length < length) {
    passwordChars.push(pickRandomChar(allChars));
  }

  const shuffledPassword = shuffleSecurely(passwordChars).join("");
  passwordOutput.value = shuffledPassword;

  updateStrength(length, allChars.length);
  showMessage("パスワードを生成しました。", false);
}

async function copyPassword() {
  const password = passwordOutput.value;

  if (!password) {
    showMessage("先にパスワードを生成してください。", true);
    return;
  }

  try {
    await navigator.clipboard.writeText(password);
    showMessage("コピーしました。", false);
  } catch {
    passwordOutput.select();
    document.execCommand("copy");
    showMessage("コピーしました。", false);
  }
}

function updateLengthLabel() {
  lengthValue.textContent = lengthRange.value;
  const selectedCharSets = getSelectedCharSets();
  const allChars = selectedCharSets.join("");
  updateStrength(Number(lengthRange.value), allChars.length);
}

function updateStrength(length, charsetSize) {
  if (charsetSize === 0) {
    strengthText.textContent = "---";
    strengthBarFill.style.width = "0%";
    strengthBarFill.style.background = "#ef4444";
    return;
  }

  const entropy = length * Math.log2(charsetSize);

  if (entropy < 50) {
    strengthText.textContent = "弱い";
    strengthBarFill.style.width = "30%";
    strengthBarFill.style.background = "#ef4444";
  } else if (entropy < 80) {
    strengthText.textContent = "普通";
    strengthBarFill.style.width = "60%";
    strengthBarFill.style.background = "#f59e0b";
  } else if (entropy < 110) {
    strengthText.textContent = "強い";
    strengthBarFill.style.width = "85%";
    strengthBarFill.style.background = "#22c55e";
  } else {
    strengthText.textContent = "とても強い";
    strengthBarFill.style.width = "100%";
    strengthBarFill.style.background = "#16a34a";
  }
}

function showMessage(text, isError) {
  message.textContent = text;
  message.style.color = isError ? "#dc2626" : "#2563eb";
}

lengthRange.addEventListener("input", updateLengthLabel);
generateButton.addEventListener("click", generatePassword);
copyButton.addEventListener("click", copyPassword);

useUppercase.addEventListener("change", updateLengthLabel);
useLowercase.addEventListener("change", updateLengthLabel);
useNumbers.addEventListener("change", updateLengthLabel);
useSymbols.addEventListener("change", updateLengthLabel);
excludeSimilar.addEventListener("change", updateLengthLabel);

updateLengthLabel();
generatePassword();

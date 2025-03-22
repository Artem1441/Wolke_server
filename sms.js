const axios = require("axios");

async function sendSms(login, password, phone, message, sender) {
  const url = "https://smsc.ru/sys/send.php";
  const params = new URLSearchParams({
    login: login,
    psw: password,
    phones: phone,
    mes: message,
    sender: sender,
    charset: "utf-8",
    fmt: "3",
  });

  try {
    const response = await axios.post(url, params);
    const data = response.data;

    if (data.id) {
      console.log(`SMS sent successfully. Message ID: ${data.id}`);
    } else {
      console.log(`Error: ${data.error_code} - ${data.error}`);
    }
  } catch (error) {
    console.error("Request failed:", error);
  }
}

const login = "тут логин";
const password = "тут пароль";
const phone = "+79044937033";
const randomDigits = Math.floor(1000 + Math.random() * 9000);
const message = `Проверка связи + отправка проверочного кода ${randomDigits}`;
const sender = "PROBOI";

sendSms(login, password, phone, message, sender);


// const login = "artemedo";
// const password = "Artemedo1441";
// const login = "proboi11012025";
// const password = "ZC3KMigoU9sy";

DB_USER=postgres
DB_HOST=localhost
DB_NAME=wolke
DB_PASSWORD=14410
DB_PORT=5432
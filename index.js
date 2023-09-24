import TelegramBot from "node-telegram-bot-api";
import fs from "fs"; // file system
import dotenv from 'dotenv'
import { base } from "./base.js";
import { products } from "./products.js";
import { keyboards } from "./keyboards.js";

dotenv.config()

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

let currentStep = "";

let myBasket = {
  products: [],
  sum: 0,
};

let userData = {
  name: "",
  lastname: "",
  products: [],
  phoneNumber: "",
  city: "",
  typePay: "",
  post: ``,
  postNumber: '',
  username: "",
};
// js -> ts 


// Char 'f'
//  String "tdsdf;kgj"

// 'text' 
// "a"


bot.setMyCommands([{ command: "start", description: "Почати бесіду" }]);

let buttons = [];

for (let i = 0; i < 5; i++) {
  if (i == 1) {
    buttons.push([{ text: "Delete", callback_data: "buy-" }]);
  } else {
    buttons.push([{ text: "Купити", callback_data: "buy-" }]);
  }
}

let newkb = {
  reply_markup: {
    inline_keyboard: buttons,
    resize_keyboard: true,
  },
};

bot.on("message", async function (message) {
  if (currentStep == "name") {
    bot.sendMessage(message.chat.id, "name +");
    userData.name = message.text;
    currentStep = "lastname";
  } else if (currentStep == "lastname") {
    bot.sendMessage(message.chat.id, "lastname +");
    userData.lastname = message.text;
    currentStep = "phoneNumber";
  } else if (currentStep == "phoneNumber") {
    bot.sendMessage(message.chat.id, "phoneNumber +");
    userData.phoneNumber = message.text;
    currentStep = "city";
  } else if (currentStep == "city") {
    bot.sendMessage(message.chat.id, "city +");
    userData.city = message.text;
    currentStep = "typePay";
  } else if (currentStep == "typePay") {
    bot.sendMessage(message.chat.id, "typePay +");
    userData.typePay = message.text;
    currentStep = "post";
  } else if (currentStep == "post") {
    bot.sendMessage(message.chat.id, "post +");
    userData.post = message.text;
    currentStep = "postNumber";
  } else if (currentStep == "postNumber") {
    bot.sendMessage(message.chat.id, "postNumber +");
    userData.postNumber = message.text;
    currentStep = "";
    console.log(userData);

    if (message.from.username != '') {
userData.username = message.from.username
    }

    let t = ''

    for (let i = 0; i < myBasket.products.length; i++) {
      t += myBasket.products[i].title + '\n'
    }

    let template = `
<b>Ура! Прийшла нова заявка!</b>

<b>ПІБ:</b> ${userData.name}  ${userData.lastname}
<b>Місто:</b>  ${userData.city}
<b>Пошта:</b>  ${userData.post}
<b>Номер пошти:</b>  ${userData.postNumber}
<b>Тип оплати:</b>  ${userData.typePay}
<b>Контактні дані:</b>  
${userData.phoneNumber}
@${userData.username}

<b>Товари:</b> 
${t}



`;

    bot.sendMessage(-1001571322958, template, { parse_mode: "HTML" });
  }

  console.log(message.text);
  // message.text = undefined;

  try {
    if (message.text == "/start") {
      if (base.counterProducts > products.length) {
        bot.sendMessage(
          message.chat.id,
          "<b>Товарів в цій категорії більше немає.</b>",
          { parse_mode: "HTML" }
        );
      }
      base.counterProducts += 2; // 10

      products.forEach(async function (product, index) {
        // формула яка рахує ціну зменшуючи оригінальну ціна на деякий відсоток

        if (index >= base.counterProducts - 2 && index < base.counterProducts) {
          const currentPrice =
            product.price - (product.price * product.discount) / 100;

          const text = `
<b>${product.title.toUpperCase()}</b>
<s>${product.price}</s>
${currentPrice}

${product.description}
  
<code>Код товару: ${product.id}</code>
  `;

          await bot.sendPhoto(message.chat.id, product.photo, {
            caption: text,
            parse_mode: "HTML",
            ...keyboards.keyboardProduct(product.id),
          });
        }
      });

      await bot.sendMessage(
        message.chat.id,
        "Якщо ви хочете побачити більше товарів, скористайтесь клавіатурою нижче",
        keyboards.keyboardNextProducts(myBasket)
      );
    }

    // null undefined
    else if (message.text.startsWith("🛒 basket")) {
      let template = `
В вашій корзині ${myBasket.products.length} товарів.
Ось повний перелік ваших товарів:
`;
      bot.sendMessage(
        message.chat.id,
        template,
        keyboards.basketProducts(myBasket.products)
      );
    } else if (message.text == "next ➡️" || message.text == "show" ) {
      if (base.counterProducts > products.length) {
        bot.sendMessage(
          message.chat.id,
          "<b>Товарів в цій категорії більше немає.</b>",
          { parse_mode: "HTML" }
        );
      }
      base.counterProducts += 2; // 10

      products.forEach(async function (product, index) {
        // формула яка рахує ціну зменшуючи оригінальну ціна на деякий відсоток

        if (index >= base.counterProducts - 2 && index < base.counterProducts) {
          const currentPrice =
            product.price - (product.price * product.discount) / 100;

          const text = `
<b>${product.title.toUpperCase()}</b>
<s>${product.price}</s>
${currentPrice}

${product.description}
  
<code>Код товару: ${product.id}</code>
  `;

          await bot.sendPhoto(message.chat.id, product.photo, {
            caption: text,
            parse_mode: "HTML",
            ...keyboards.keyboardProduct(product.id),
          });
        }
      });

      await bot.sendMessage(
        message.chat.id,
        "Якщо ви хочете побачити більше товарів, скористайтесь клавіатурою нижче",
        keyboards.keyboardNextProducts(myBasket)
      );
    } else if (message.text == "⬅️ prev" || message.text == "prev") {
      base.counterProducts -= 2; // 10
      if (base.counterProducts < 0) {
        bot.sendMessage(
          message.chat.id,
          "<b>Товарів в цій категорії більше немає.</b>",
          { parse_mode: "HTML" }
        );
      }

      products.forEach(async function (product, index) {
        // формула яка рахує ціну зменшуючи оригінальну ціна на деякий відсоток

        if (index >= base.counterProducts - 2 && index < base.counterProducts) {
          const currentPrice =
            product.price - (product.price * product.discount) / 100;

          const text = `
<b>${product.title.toUpperCase()}</b>
<s>${product.price}</s>
${currentPrice}

${product.description}
  
<code>Код товару: ${product.id}</code>
  `;

          await bot.sendPhoto(message.chat.id, product.photo, {
            caption: text,
            parse_mode: "HTML",
            ...keyboards.keyboardProduct(product.id),
          });
        }
      });

      await bot.sendMessage(
        message.chat.id,
        "Якщо ви хочете побачити більше товарів, скористайтесь клавіатурою нижче 👇",
        keyboards.keyboardNextProducts(myBasket)
      );
    }

    ("<b>text</b>");
    ("text</b>");
  } catch (error) {}
});

// При клікі на інлайнову (прозору) клавіатуру
bot.on("callback_query", function (message) {
  // let a = bot.sendMessage(message.message.chat.id, message.data);
  if (message.data == "view-product") {
  }
  if (message.data == "completeOrder") {
    bot.sendMessage(message.message.chat.id, "Введіть ваше ім'я:");
    bot.sendMessage(message.message.chat.id, message.from.first_name);
    currentStep = "name";
    // email reklama email (1 000 000) 10 000 000 UAH 0.002% 0.003% (5000$) asdfsadfsdf114 ! Marketing
    console.log(message);
  }

  if (message.data == "deleteBasketItem") {
    // modal window open also onclick transparent button
    bot.answerCallbackQuery(message.id, {
      text: "Більше елементів в цій категорії немає",
      show_alert: false,
    });

    bot.sendMessage(message.message.chat.id, "delete success");
  }

  if (message.data.startsWith("basketItem")) {
    const buttonText = message.message.reply_markup.inline_keyboard[0][0].text;
    const isChecked = buttonText.includes("✅");

    // Змінюємо текст кнопки на "⬜️footbalka nano - 300 UAH" або "✅footbalka nano - 300 UAH"
    const updatedButtonText = isChecked
      ? "⬜️ " + buttonText.slice(1)
      : "✅" + buttonText.slice(1);

    // Копіюємо поточну структуру inline_keyboard
    const inlineKeyboard = message.message.reply_markup.inline_keyboard;

    // Знаходимо індекс кнопки, яку потрібно змінити
    const buttonIndexToChange = inlineKeyboard.findIndex((row) => {
      return row.some((button) => button.callback_data === message.data);
    });

    if (buttonIndexToChange !== -1) {
      // Змінюємо текст обраної кнопки
      inlineKeyboard[buttonIndexToChange][0].text = updatedButtonText;

      // Відправляємо оновлену клавіатуру
      bot.editMessageText(message.message.text, {
        chat_id: message.message.chat.id,
        message_id: message.message.message_id,
        parse_mode: "HTML", // Залежно від необхідності
        reply_markup: {
          inline_keyboard: inlineKeyboard,
        },
      });
    }
  }

  if (message.data.startsWith("buy-")) {
    let id = message.data.slice(4);
    let title;

    products.forEach((product) => {
      if (product.id == id) {
        let r = product.price - (product.price * product.discount) / 100;
        myBasket.sum += r
        title = product.title

        myBasket.products.push({
          title: product.title,
          price: r,
          id: product.id
        });
      }

    });

    bot.sendMessage(
      message.message.chat.id,
      `Ви купили товар ${title}`,
      keyboards.keyboardNextProducts(myBasket)
    );
  }

  if (message.data.startsWith("favorites-")) {
    let id = message.data.slice(10);
    let title;
    products.forEach((product) => {
      if (product.id == id) {
        title = product.title;
      }
    });
    bot.sendMessage(
      message.message.chat.id,
      `Ви додали в обране товар ${title}`
    );
  }

  if (message.data.startsWith("chat-")) {
    let id = message.data.slice(5);
    let title;
    products.forEach((product) => {
      if (product.id == id) {
        title = product.title;
      }
    });
    bot.sendMessage(
      message.message.chat.id,
      `Вас цікавить товар ${title} . Чим можу допомогти?`
    );
  }
});

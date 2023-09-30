let base = {
  token: "6477965216:AAFBVcvN0NkL-PiBKrwp4x6_obv86J26p8s", // 1 server: 1 bot
  id: 6187531089,
  counterProducts: 0,

  dice: ["🎲", "🎯", "🏀", "⚽", "🎳", "🎰"],

  clientTemplate: {
    name: "",
    lastname: "",
    phoneNumber: "",
    email: "",
    address: "",
  },
  name: 'Delivery'
};

export { base };


// cron - за розкладом

// site - speed - simple - cheap - 500 UAH
// app (tg bot, parsers, ) - long - hard - expensive - 2600 UAH - 10 000 UAH
// deploy - na server (setting) - продакшн

// Засипання - вимушена міра, щоб платили гроші.
// Засипання проекту. Без дії 30 хвилин. 
// Пробудити (30-40 секунд)
// cron - фетч завантажує сайт кожні 15 хвилин. 

// Гра. Реліз. - взламують за 48 годин. 





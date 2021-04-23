"use strict";

const now = new Date();

//Методы 'Геторы'

// console.log(now);

//Методы получения компоненотов даты
// console.log(now.getFullYear());
// console.log(now.getMonth()); //месяцы нумеруются от 0
// console.log(now.getDate());
// console.log(now.getHours());
// console.log(now.getDay())//нумерация от воскресения = 0, 6 день недели - суббота
// console.log(now.getUTCHours());

//getTime
// 
// console.log(now.getTimezoneOffset()); //разница между часовым поясом и utc в минутах

// console.log(now.getTime());

// методы "Сеторы"

let start = new Date();

for (let i = 0; i < 100000; i++) {
    const element = i ** 3;

}

let end = new Date();

console.log(`цикл отработал за ${end - start} миллисекунд`)
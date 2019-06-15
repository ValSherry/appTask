const Koa = require('koa');
const views = require('koa-views');
const static = require('koa-static');
const fs = require('fs');
const path = require('path');
const body = require('./index');
const app = new Koa();

app.use(body());

app.use(static( path.join( __dirname,  './static')))

//Подключаем ejs
app.use(views(path.join(__dirname, './view'), {extension: 'ejs'}))

// Переходы по страницам
app.use(async(ctx, next) => {
  title = 'Задачи';
  if (ctx.url === '/') {
    // Переход на главную страницу
    await ctx.render('index', {title, }) 
  } else if (ctx.url === '/verification' && ctx.method === 'POST') {
	// Переход на страницу c задачами для пользователя
    if (z === 'Пароль введен верно') {
	  rez = z;
	  list = m;
	  name = x;
	  await ctx.render('success', {title, list, name, rez, }) 
      console.log(z);
	// Переход на страницу с сообщением о неверном пароле
	} else {
	  rez = z;
	  await ctx.render('unsuccess', {title, rez, }) 
      console.log(z);
    }	
  // Переход на страницу с регистрацией пользователя
  } else if (ctx.url === '/registration') {
    await ctx.render('registration', {title, }) 
	// Переход на страницу с сообщением как прошла регистрация
    if (ctx.url === '/registration' && ctx.method === 'POST') {
	  rez = z;  
	  await ctx.render('ok', {title, rez, }) 
    }  
  // Ошибка
  } else {
    ctx.body = '<h1>404';
  }
  await next();
});

app.listen(3000, () => {
  console.log('Is starting at port 3000');
});

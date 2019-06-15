const readStream = require('./lib/read_stream');
let strictJSONReg = /^[\x20\x09\x0a\x0d]*(\[|\{)/;
// Подключение к БД
const { Client } = require('pg')
// параметры для подключения
const connection = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Postgres',
  database: 'db'
});

let jsonTypes = [
  'application/json'
];

let formTypes = [
  'application/x-www-form-urlencoded'
];

let textTypes = [
  'text/plain'
];

// Выделяем введеные логин и пароль
async function parseQueryStr(queryStr,) {
  let queryData = {};
  let queryStrList = queryStr.split('&');
  let itemList = queryStrList[0].split('=');
  let nm = decodeURIComponent(itemList[1]);
  let itemList1 = queryStrList[1].split('=');
  let pass = decodeURIComponent(itemList1[1]);
  // Вызываем функцию проверки пароля
  let result = await getDataX(nm,pass);
  // Вызываем функцию поиска задач в базе данных
  let tasks = await getTaskX(nm);
  return [result, tasks, nm];
}

function bodyParser(opts = {}) {
  return async function(ctx, next) {
	// Проверка пароля и поиск задач  
    if (!ctx.request.body && ctx.method === 'POST' && ctx.url === '/verification') {
      let body = await readStream(ctx.request.req);
      let result = body;
      if (ctx.request.is(formTypes)) {
        [result1, result2, result3] = await parseQueryStr(body);
      } else if (ctx.request.is(jsonTypes)) {
        if (strictJSONReg.test(body)) {
          try {
            result = JSON.parse(body);
          } catch (err) {
            ctx.throw(500, err);
          }
        }
      } else if (ctx.request.is(textTypes)) {
        result = body;
      }
      // Возвращаем результаты проверки пароля и поиска задач
      z=result1;
	  m=result2;
	  x=result3;
    }
	// Регистрация
	if (!ctx.request.body && ctx.method === 'POST' && ctx.url === '/registration') {
      body1 = await readStream(ctx.request.req);
	  result4 = await addUser(body1);
	  z = result4;
	}
	await next();
  }
}

// Формирование поиска
let query = function( sql, values ) {
  return new Promise(( resolve, reject ) => {
    connection.connect(
      connection.query(sql, values, ( err, rows) => {
        if ( err ) {
          reject( err );
        } else {
          resolve( rows );
        }
      })
    )
  })
}

// Запрос пользователей
async function selectAllData( ) {
  let sql = 'SELECT * FROM users'
  let dataList = await query( sql )
  return dataList
}

// Проверка пароля
async function getDataX(a,b) {
  let dataList = await selectAllData()
  for (i = 0; i < dataList.rowCount; ++i){
	let n = dataList.rows[i].username.trim();
    let p = dataList.rows[i].pass.trim();
    if (((n === a) && (p === b) && (a !== ''))){
      otv = 'Пароль введен верно';
	  break;
    } else {
	  otv = 'Пароль введен неверно';
	}
  }
  return otv;
}

// Запрос задач
async function tableData() {
  let sql = 'SELECT username, task FROM tasks_user';
  let taskList = await query( sql );
  return taskList
}

// Формирование списка задач
async function getTaskX(a) {
  let taskList = await tableData()
  let list = [];	
  let j = 0;
    for (i = 0; i < taskList.rowCount; ++i){
	  n = taskList.rows[i].username.trim();
	  if  (n === a){
	    list[j] = taskList.rows[i].task.trim();
	    j++;
	  }
    }
  return list;
}

// Регистрация пользователя
async function addUser(a) {
  
  queryStrList = a.split('&');

  // Вычленяем логин
  nm = queryStrList[0].split('=');
  username=decodeURIComponent(nm[1]);

  // Вычленяем пароль
  ps=queryStrList[1].split('=');
  pass=decodeURIComponent(ps[1]);

  // Вводим допустимые значения
  p = /^[a-zA-Z0-9]+$/;

  // Флаги проверки
  f1 = 0;
  f2 = 0;

  // Проверяем имя пользователя 
  let dataList = await selectAllData()
 
     if (username.length < 6) { 
        otv = 'Слишком короткое имя ' + username;
	  } else if (username.length > 20) { 
        otv = 'Слишком длинное имя ' + username;
      } else if (p.test(username)) {
		for (i = 0; i < dataList.rowCount; ++i) {
	      n=dataList.rows[i].username.trim();
          if (username === n){
	        otv = 'Пользователь ' + username + ' уже есть в базе данных';
			f1 = 0; 
	        break;
          } else {
			otv = 'Хороший логин ' + username;
            f1 = 1; 
		  }
		  }
	  } else {
	    otv = 'Недопустимые символы в имени ' + username; 
      }
	  
  // Проверяем пароль 
  if (pass.length < 6) { 
    otv = otv +  '. Слишком короткий пароль';
  } else if (pass.length > 20) { 
    otv = '. Слишком длинный пароль';
  } else if (p.test(pass)) {
	otv = otv + '. Хороший пароль'; 
	f2=1;
  } else {
	otv = otv + '. Недопустимые символы в пароле'; 	 
  }

  // Регистрируем пользователя в базе данных
  if ((f1 === 1) && (f2 === 1)) {
    const values = [username, pass];
    const sql = 'INSERT INTO users (username, pass) VALUES ($1, $2)';
    connection.query(sql, values, (err, res) => {
      if(err) {
        console.log(err);
	    otv = otv + '. Повторите ввод.';
      } else { 
	    // При удачной записи вернуть положительный ответ
	    console.log(otv);
		otv = otv + '. Пользователь добавлен.';
      }
    });
  } 

  return otv;
}

module.exports = bodyParser;

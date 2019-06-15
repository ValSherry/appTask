# appTask
Создано мультистраничное веб-приложение
Бэк - Koa.js
Фронт - Ejs.js

В качестве базы данных использован PostgreSQL.
Параметры базы данных: const client = new Client({ host: 'localhost', port: 5432, user: 'postgres', password: 'Postgres', database: 'db' }); 

В базе данных созданы таблицы: 
1) users 
CREATE TABLE public.users
(
    username character(20) COLLATE pg_catalog."default" NOT NULL,
    pass character(20) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Au_pkey" PRIMARY KEY (username)
)

2)tasks_user
CREATE TABLE public.tasks_user
(
    username character(20) COLLATE pg_catalog."default" NOT NULL,
    id integer NOT NULL DEFAULT nextval('tasks_user_id_seq'::regclass) ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    task character(140) COLLATE pg_catalog."default",
    CONSTRAINT tasks_user_pkey PRIMARY KEY (id)
)


Необходимо установить
npm install koa
npm install koa-views
npm install koa-static
npm install pg
npm install ejs

Затем выполнить команду
node app.js

Запускается приложение - http://localhost:3000

Главная страница
![alt text](images/index.jpg) 

Страница с выводом из базы данных 
![alt text](images/Zadachi.jpg) 

Страница регистрации
![alt text](images/reristration.jpg) 

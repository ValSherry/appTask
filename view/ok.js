<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="/css/style.css" />
    <title><%= title %></title>
  </head>
  <body>
    <h1><%= title %></h1>
    <div>
    <p><%= rez %></p>
	<input value="Вернуться к регистрации" type="button" class="button" onclick="location.href='/registration'" /><br/> 
    <input value="Вернуться на главную" type="button" class="button" onclick="location.href='/'" /><br/>
  </body> 
</html>

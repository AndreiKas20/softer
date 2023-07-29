# Приложения для загрузки файлов на Яндекс.Диск


## Рабочие скрипты для запуска

Для полноценного запуска приложения используйте

### `npm start`

Приложение запустится в режиме разработчика. Запустится как клиентская, так и серверная часть.
на  [http://localhost:3000](http://localhost:3000) клиент и на 3001 порту сервер. 


## О сборке

Поскольку нет возможности на прямую отправлять файлы на API яндекс.диск в приложении вместе с запуском приложения запускается локальный сервер на Express для отправки файлов транзитом через него. Редирект при авторизации в яндекс происходит на [http://localhost:3000](http://localhost:3000)

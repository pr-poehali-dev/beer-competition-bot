# Настройка Telegram бота

## ✅ Бот готов к работе!

### Webhook URL:
```
https://functions.poehali.dev/09684b01-5e78-44aa-be92-055f03bb1bd8
```

### Установка webhook:

Открой в браузере этот URL (замени `YOUR_BOT_TOKEN` на твой токен):

```
https://api.telegram.org/bot8262285512:AAFrJUcZN-Se5af9UfvHtXMTYBK01yqJLJg/setWebhook?url=https://functions.poehali.dev/09684b01-5e78-44aa-be92-055f03bb1bd8
```

Или скопируй эту готовую ссылку:
```
https://api.telegram.org/bot8262285512:AAFrJUcZN-Se5af9UfvHtXMTYBK01yqJLJg/setWebhook?url=https://functions.poehali.dev/09684b01-5e78-44aa-be92-055f03bb1bd8
```

### После установки webhook:

1. Найди своего бота в Telegram
2. Нажми `/start`
3. Используй команды:
   - `/pivo` - выпить пива 🍺
   - `/top` - топ чата 🏆
   - `/global` - глобальный топ 🌍
   - `/buy` - купить попытки ⭐
   - `/admin` - админ панель 🛡️
   - `/help` - справка

### Как стать админом:

Подключись к базе данных и выполни:
```sql
UPDATE users SET is_admin = true WHERE telegram_id = ВАШ_TELEGRAM_ID;
```

Твой Telegram ID можно узнать через бота @userinfobot

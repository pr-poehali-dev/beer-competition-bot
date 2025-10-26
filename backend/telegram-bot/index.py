import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
import urllib.request
import urllib.parse

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Telegram bot webhook handler for beer competition
    Args: event with httpMethod, body containing Telegram updates
    Returns: HTTP response with bot replies
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    update = json.loads(event.get('body', '{}'))
    
    if 'message' not in update:
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True})
        }
    
    message = update['message']
    chat_id = message['chat']['id']
    user_id = message['from']['id']
    username = message['from'].get('username', 'Игрок')
    first_name = message['from'].get('first_name', 'Игрок')
    text = message.get('text', '')
    
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    db_url = os.environ.get('DATABASE_URL')
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute(
        "SELECT * FROM users WHERE telegram_id = %s",
        (user_id,)
    )
    user = cur.fetchone()
    
    if not user:
        cur.execute(
            "INSERT INTO users (telegram_id, username, first_name, chat_id) VALUES (%s, %s, %s, %s) RETURNING *",
            (user_id, username, first_name, chat_id)
        )
        user = cur.fetchone()
        conn.commit()
    
    response_text = ""
    
    if text == '/start':
        response_text = f"🍺 Привет, {first_name}!\n\nДобро пожаловать в Пивной Турнир!\n\nТвои попытки: {user['attempts']}\nВсего выпито: {user['total_beers']} мл\n\nКоманды:\n/pivo - выпить пива\n/top - топ чата\n/global - глобальный топ\n/buy - купить попытки\n/help - справка"
    
    elif text == '/pivo':
        if user['attempts'] <= 0:
            response_text = "😢 У тебя закончились попытки!\n\nКупи ещё командой /buy"
        else:
            import random
            amount = random.randint(100, 600)
            
            cur.execute(
                "UPDATE users SET attempts = attempts - 1, total_beers = total_beers + %s WHERE telegram_id = %s",
                (amount, user_id)
            )
            cur.execute(
                "INSERT INTO beer_drinks (user_id, amount) VALUES ((SELECT id FROM users WHERE telegram_id = %s), %s)",
                (user_id, amount)
            )
            conn.commit()
            
            new_attempts = user['attempts'] - 1
            new_total = user['total_beers'] + amount
            
            response_text = f"🍺 Ты выпил {amount} мл пива!\n\n✨ Осталось попыток: {new_attempts}\n📊 Всего выпито: {new_total} мл"
    
    elif text == '/top':
        cur.execute(
            "SELECT first_name, total_beers FROM users WHERE chat_id = %s ORDER BY total_beers DESC LIMIT 10",
            (chat_id,)
        )
        top_users = cur.fetchall()
        
        response_text = "🏆 Топ чата:\n\n"
        medals = ['🥇', '🥈', '🥉']
        for i, u in enumerate(top_users):
            medal = medals[i] if i < 3 else f"{i+1}."
            response_text += f"{medal} {u['first_name']} - {u['total_beers']} мл\n"
    
    elif text == '/global':
        cur.execute(
            "SELECT first_name, total_beers FROM users ORDER BY total_beers DESC LIMIT 10"
        )
        global_users = cur.fetchall()
        
        response_text = "🌍 Глобальный топ:\n\n"
        medals = ['🥇', '🥈', '🥉']
        for i, u in enumerate(global_users):
            medal = medals[i] if i < 3 else f"{i+1}."
            response_text += f"{medal} {u['first_name']} - {u['total_beers']} мл\n"
    
    elif text == '/buy':
        response_text = "⭐ Магазин попыток:\n\n1️⃣ 1 попытка - 5 звёзд\n3️⃣ 3 попытки - 10 звёзд (выгодно!)\n🔟 10 попыток - 25 звёзд\n\n💡 Оплата через Telegram Stars"
    
    elif text == '/admin':
        if user['is_admin']:
            cur.execute("SELECT COUNT(*) as count FROM users")
            total_users = cur.fetchone()['count']
            
            cur.execute("SELECT SUM(total_beers) as total FROM users")
            total_beers = cur.fetchone()['total'] or 0
            
            response_text = f"🛡️ Админ-панель\n\n👥 Всего игроков: {total_users}\n🍺 Всего выпито: {total_beers} мл ({total_beers/1000:.1f} л)"
        else:
            response_text = "❌ У тебя нет прав администратора"
    
    elif text == '/help':
        response_text = "ℹ️ Команды бота:\n\n/start - главное меню\n/pivo - выпить пива 🍺\n/top - топ чата 🏆\n/global - глобальный топ 🌍\n/buy - магазин попыток ⭐\n/admin - админ панель 🛡️"
    
    else:
        response_text = "🤔 Неизвестная команда. Используй /help для списка команд."
    
    cur.close()
    conn.close()
    
    if bot_token:
        telegram_url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        data = urllib.parse.urlencode({
            'chat_id': chat_id,
            'text': response_text
        }).encode()
        
        req = urllib.request.Request(telegram_url, data=data)
        try:
            urllib.request.urlopen(req)
        except Exception:
            pass
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({'ok': True})
    }

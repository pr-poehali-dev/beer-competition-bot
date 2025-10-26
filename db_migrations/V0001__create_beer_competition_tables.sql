CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username VARCHAR(255),
  first_name VARCHAR(255),
  chat_id BIGINT,
  attempts INT DEFAULT 3,
  total_beers INT DEFAULT 0,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS beer_drinks (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  amount INT NOT NULL,
  drunk_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_users_chat_id ON users(chat_id);
CREATE INDEX IF NOT EXISTS idx_beer_drinks_user_id ON beer_drinks(user_id);
CREATE INDEX IF NOT EXISTS idx_users_total_beers ON users(total_beers DESC);
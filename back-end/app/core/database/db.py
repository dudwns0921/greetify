import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "locations.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    conn.execute(
        '''
        CREATE TABLE IF NOT EXISTS locations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL
        )
        '''
    )
    conn.commit()
    conn.close()

def save_location(latitude: float, longitude: float):
    conn = get_db_connection()
    conn.execute(
        'INSERT INTO locations (latitude, longitude) VALUES (?, ?)',
        (latitude, longitude)
    )
    conn.commit()
    conn.close() 
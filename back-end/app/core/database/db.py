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
            id TEXT PRIMARY KEY,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL
        )
        '''
    )
    conn.commit()
    conn.close()

def save_location(session_id: str, latitude: float, longitude: float):
    conn = get_db_connection()
    conn.execute(
        '''
        INSERT INTO locations (id, latitude, longitude)
        VALUES (?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET latitude=excluded.latitude, longitude=excluded.longitude
        ''',
        (session_id, latitude, longitude)
    )
    conn.commit()
    conn.close() 
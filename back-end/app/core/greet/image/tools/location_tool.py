import sqlite3
import os


def get_latest_location(session_id: str):
    db_path = os.path.join(os.path.dirname(__file__), "../../../database/locations.db")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT latitude, longitude FROM locations WHERE id = ? ORDER BY rowid DESC LIMIT 1", (session_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return row[0], row[1]
    return None, None

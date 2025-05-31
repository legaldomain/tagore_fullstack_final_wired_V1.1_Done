import sqlite3

class DraftTracker:
    def __init__(self, db_path="drafts.db"):
        self.db_path = db_path
        self.create_table()

    def create_table(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "CREATE TABLE IF NOT EXISTS drafts (id INTEGER PRIMARY KEY, filename TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)"
            )

    def add_draft(self, filename):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("INSERT INTO drafts (filename) VALUES (?)", (filename,))

    def get_drafts(self):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM drafts ORDER BY timestamp DESC")
            return cursor.fetchall()

    def close(self):
        pass

    
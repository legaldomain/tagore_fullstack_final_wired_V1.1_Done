
class HistoryTracker:
    def __init__(self):
        self.history = []

    def log(self, filename, content):
        self.history.append({"filename": filename, "content": content})

    def get_history(self):
        return self.history

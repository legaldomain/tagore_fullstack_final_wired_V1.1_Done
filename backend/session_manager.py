class SessionManager:
    def __init__(self):
        self.active_file = None

    def switch_file(self, filename):
        self.active_file = filename

    def get_active_file(self):
        return self.active_file

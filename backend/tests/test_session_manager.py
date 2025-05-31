import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(os.path.dirname(__file__))))
from session_manager import SessionManager

def test_switch_and_get_active_file():
    session = SessionManager()
    assert session.get_active_file() is None
    session.switch_file("file1.txt")
    assert session.get_active_file() == "file1.txt"
    session.switch_file("file2.txt")
    assert session.get_active_file() == "file2.txt" 
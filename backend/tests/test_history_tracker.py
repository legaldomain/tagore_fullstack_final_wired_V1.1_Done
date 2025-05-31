import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(os.path.dirname(__file__))))
from history_tracker import HistoryTracker

def test_log_and_get_history():
    history = HistoryTracker()
    assert history.get_history() == []
    history.log("file1.txt", "content1")
    history.log("file2.txt", "content2")
    hist = history.get_history()
    assert len(hist) == 2
    assert hist[0]["filename"] == "file1.txt"
    assert hist[0]["content"] == "content1"
    assert hist[1]["filename"] == "file2.txt"
    assert hist[1]["content"] == "content2" 
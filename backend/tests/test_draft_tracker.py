import sys
import os
import sqlite3
import pytest
import gc
import time
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))
from draft_tracker import DraftTracker
test_db = "test_drafts.db"

def setup_module(module):
    # Remove test db if exists
    if os.path.exists(test_db):
        os.remove(test_db)

def teardown_module(module):
    # Retry file removal in case of Windows file lock
    for _ in range(5):
        try:
            if os.path.exists(test_db):
                os.remove(test_db)
            break
        except PermissionError:
            time.sleep(0.1)

def test_add_and_get_drafts():
    tracker = DraftTracker(test_db)
    tracker.add_draft("file1.txt")
    tracker.add_draft("file2.txt")
    drafts = tracker.get_drafts()
    filenames = [row[1] for row in drafts]
    assert "file1.txt" in filenames
    assert "file2.txt" in filenames
    del tracker
    gc.collect()

def test_add_and_get_drafts():
    tracker = DraftTracker(test_db)
    tracker.add_draft("file1.txt")
    tracker.add_draft("file2.txt")
    drafts = tracker.get_drafts()
    filenames = [row[1] for row in drafts]
    assert "file1.txt" in filenames
    assert "file2.txt" in filenames
    tracker.close()  # <-- Add this line
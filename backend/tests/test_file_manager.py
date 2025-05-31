import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(os.path.dirname(__file__))))
from file_manager import FileManager

test_dir = "test_documents"

def setup_module(module):
    os.makedirs(test_dir, exist_ok=True)

def teardown_module(module):
    # Clean up test files after tests
    for f in os.listdir(test_dir):
        os.remove(os.path.join(test_dir, f))

def test_save_and_load_file():
    fm = FileManager(test_dir)
    filename = "test_novel.txt"
    content = "This is a test draft for novel mode."
    fm.save_file(filename, content)
    loaded = fm.load_file(filename)
    assert loaded == content

def test_list_files():
    fm = FileManager(test_dir)
    filename = "test_novel.txt"
    files = fm.list_files()
    assert filename in files

def test_load_missing_file():
    fm = FileManager(test_dir)
    assert fm.load_file("nonexistent.txt") == ""

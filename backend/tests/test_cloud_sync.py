import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(os.path.dirname(__file__))))
from cloud_sync import CloudSync

def test_toggle_and_get_sync_status():
    cloud = CloudSync()
    assert cloud.get_sync_status() is False
    cloud.toggle_sync(True)
    assert cloud.get_sync_status() is True
    cloud.toggle_sync(False)
    assert cloud.get_sync_status() is False 
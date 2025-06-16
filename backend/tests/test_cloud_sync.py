import sys
import os
import pytest
import asyncio
import pickle
from unittest.mock import patch, MagicMock, mock_open
sys.path.insert(0, os.path.abspath(os.path.dirname(os.path.dirname(__file__))))
from cloud_sync import CloudSync

class MockCredentials:
    def __init__(self, valid=True):
        self.valid = valid
        self.expired = False
        self.refresh_token = True

    def refresh(self, request):
        pass

@pytest.fixture
def cloud_sync():
    return CloudSync()

def test_toggle_and_get_sync_status(cloud_sync):
    assert cloud_sync.get_sync_status() is False
    cloud_sync.toggle_sync(True)
    assert cloud_sync.get_sync_status() is True
    cloud_sync.toggle_sync(False)
    assert cloud_sync.get_sync_status() is False

@patch('cloud_sync.InstalledAppFlow')
@patch('cloud_sync.build')
@patch('cloud_sync.os.path.exists')
@patch('cloud_sync.open', new_callable=mock_open)
def test_authenticate_success(mock_file, mock_exists, mock_build, mock_flow, cloud_sync):
    # Mock the credentials
    mock_creds = MockCredentials()
    mock_flow.from_client_secrets_file.return_value.run_local_server.return_value = mock_creds
    
    # Mock the build service
    mock_service = MagicMock()
    mock_build.return_value = mock_service
    
    # Mock file operations
    mock_exists.return_value = False
    
    assert cloud_sync.authenticate() is True
    assert cloud_sync.service is not None

@patch('cloud_sync.InstalledAppFlow')
@patch('cloud_sync.build')
@patch('cloud_sync.os.path.exists')
@patch('cloud_sync.open', new_callable=mock_open)
def test_authenticate_with_existing_token(mock_file, mock_exists, mock_build, mock_flow, cloud_sync):
    # Mock the credentials
    mock_creds = MockCredentials()
    
    # Mock file operations
    mock_exists.return_value = True
    mock_file.return_value.__enter__.return_value.read.return_value = pickle.dumps(mock_creds)
    
    assert cloud_sync.authenticate() is True
    assert cloud_sync.service is not None

@patch('cloud_sync.MediaFileUpload')
def test_upload_file_success(mock_media_upload, cloud_sync):
    # Mock the service
    mock_service = MagicMock()
    mock_file = MagicMock()
    mock_file.get.return_value = 'test_file_id'
    mock_service.files.return_value.create.return_value.execute.return_value = mock_file
    cloud_sync.service = mock_service
    
    # Mock the media upload
    mock_media = MagicMock()
    mock_media_upload.return_value = mock_media
    
    result = cloud_sync.upload_file('test.txt')
    assert result == 'test_file_id'

@patch('cloud_sync.MediaFileUpload')
def test_upload_file_failure(mock_media_upload, cloud_sync):
    # Mock the service
    mock_service = MagicMock()
    mock_service.files.return_value.create.return_value.execute.side_effect = Exception('Upload failed')
    cloud_sync.service = mock_service
    
    # Mock the media upload
    mock_media = MagicMock()
    mock_media_upload.return_value = mock_media
    
    result = cloud_sync.upload_file('test.txt')
    assert result is False 
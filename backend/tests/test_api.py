import os
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root():
    resp = client.get("/")
    assert resp.status_code == 200
    assert "message" in resp.json()

def test_file_crud():
    filename = "apitest.txt"
    content = "api test content"
    # Save file
    resp = client.post(f"/api/file/{filename}", json={"content": content})
    assert resp.status_code == 200
    # Get file
    resp = client.get(f"/api/file/{filename}")
    assert resp.status_code == 200
    assert resp.json()["content"] == content
    # List files
    resp = client.get("/api/files")
    assert resp.status_code == 200
    assert filename in resp.json()["files"]
    # Rename file
    new_filename = "apitest_renamed.txt"
    resp = client.put(f"/api/file/{filename}", json={"new_filename": new_filename})
    assert resp.status_code == 200
    # Delete file
    resp = client.delete(f"/api/file/{new_filename}")
    assert resp.status_code == 200

def test_drafts():
    filename = "draft_api.txt"
    content = "draft content"
    # Save draft
    resp = client.post("/api/drafts", json={"filename": filename, "content": content})
    assert resp.status_code == 200
    # Get drafts
    resp = client.get("/api/drafts")
    assert resp.status_code == 200
    # Load draft
    resp = client.get(f"/api/drafts/{filename}")
    assert resp.status_code == 200

def test_ai_assist():
    prompt = "assist me"
    resp = client.post("/api/ai/assist", json={"prompt": prompt})
    assert resp.status_code == 200
    assert "suggestion" in resp.json()

def test_grammar_check():
    text = "This is bad."
    resp = client.post("/api/grammar-check", json={"text": text})
    assert resp.status_code == 200
    assert "corrections" in resp.json() or isinstance(resp.json(), dict)

def test_history():
    filename = "hist.txt"
    content = "history content"
    # Log history
    resp = client.post("/api/history/log", json={"filename": filename, "content": content})
    assert resp.status_code == 200
    # Get history
    resp = client.get("/api/history")
    assert resp.status_code == 200
    assert "history" in resp.json()

def test_cloud_sync_status():
    resp = client.get("/cloud-sync/status")
    assert resp.status_code == 200
    assert "synced" in resp.json() 
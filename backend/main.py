from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from file_manager import FileManager
from draft_tracker import DraftTracker
from fingerprint import FingerprintAuth
from session_manager import SessionManager
from cloud_sync import CloudSync

app = FastAPI()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add production URL when deploying
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Instantiate services      
file_mgr = FileManager()
tracker = DraftTracker()
auth = FingerprintAuth()
session = SessionManager()
cloud = CloudSync()

@app.get("/")
def root():
    return {"message": "Welcome to Tagore! FastAPI Backend is running."}

@app.get("/api/files")
def list_files(notebook: str = None):
    return {"files": file_mgr.list_files(notebook)}

@app.get("/api/file/{filename:path}")
def get_file(filename: str):
    print(f"Attempting to load file: {filename}")  # Debug log
    
    # Ensure the filename has .txt extension
    if not filename.endswith('.txt'):
        filename += '.txt'
    
    try:
        content = file_mgr.load_file(filename)
        if content == "":
            raise HTTPException(status_code=404, detail="File not found")
        return {"filename": filename, "content": content}
    except Exception as e:
        print(f"Error in get_file: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=f"Failed to load file: {str(e)}")

@app.post("/api/file/{filename:path}")
async def save_file(filename: str, request: Request):
    data = await request.json()
    content = data.get("content", "")
    
    print(f"Saving file: {filename}")  # Debug log
    print(f"Content length: {len(content)}")  # Debug log
    print(f"Content type: {type(content)}")  # Debug log
    print(f"Content preview: {content[:100] if content else 'None'}")  # Debug log
    
    # Ensure the filename has .txt extension
    if not filename.endswith('.txt'):
        filename += '.txt'
    
    try:
        file_mgr.save_file(filename, content)
        return {"status": "saved", "filename": filename}
    except Exception as e:
        print(f"Error in save_file: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

@app.delete("/api/file/{filename:path}")
def delete_file(filename: str):
    if file_mgr.delete_file(filename):
        return {"status": "deleted"}
    raise HTTPException(status_code=404, detail="File not found")

@app.put("/api/file/{old_filename:path}")
async def rename_file(old_filename: str, request: Request):
    data = await request.json()
    new_filename = data.get("new_filename")
    if not new_filename:
        raise HTTPException(status_code=400, detail="New filename not provided")
    
    if file_mgr.rename_file(old_filename, new_filename):
        return {"status": "renamed"}
    raise HTTPException(status_code=404, detail="File not found")

@app.get("/api/drafts")
def get_drafts():
    return {"drafts": tracker.get_drafts()}

@app.post("/api/drafts")
async def save_draft(request: Request):
    data = await request.json()
    filename = data.get("filename")
    content = data.get("content")
    if not filename or content is None:
        raise HTTPException(status_code=400, detail="Filename and content are required")
    
    file_mgr.save_file(filename, content)
    tracker.add_draft(filename)
    return {"status": "saved"}

@app.get("/api/drafts/{filename:path}")
def load_draft(filename: str):
    content = file_mgr.load_file(filename)
    return {"content": content}

@app.post("/api/session/{filename}")
def switch_file(filename: str):
    session.switch_file(filename)
    return {"status": f"Switched to {filename}"}

@app.post("/api/cloud/auth")
def cloud_auth():
    cloud.authenticate()
    return {"status": "authenticated"}

@app.post("/api/cloud/sync/{enabled}")
def toggle_sync(enabled: bool):
    cloud.toggle_sync(enabled)
    return {"sync_enabled": enabled}


from ai_assistant import AIAssistant
from grammar_checker import GrammarChecker
from history_tracker import HistoryTracker

ai = AIAssistant()
grammar = GrammarChecker()
history = HistoryTracker()

@app.post("/api/ai/assist")
async def ai_assist(request: Request):
    data = await request.json()
    prompt = data.get("prompt", "")
    suggestion = ai.assist(prompt)
    return {"suggestion": suggestion}

@app.post("/api/grammar-check")
async def grammar_check(request: Request):
    data = await request.json()
    text = data.get("text", "")
    return grammar.check(text)

@app.post("/api/history/log")
async def log_history(request: Request):
    data = await request.json()
    filename = data.get("filename")
    content = data.get("content")
    history.log(filename, content)
    return {"status": "logged"}

@app.get("/api/history")
def get_history():
    return {"history": history.get_history()}

@app.post("/api/compile")
async def compile_notes(request: Request):
    data = await request.json()
    filenames = data.get("filenames", [])
    compiled = ""
    for name in filenames:
        compiled += f"--- {name} ---\n"
        compiled += file_mgr.load_file(name) + "\n"
    return {"compiled": compiled}

@app.post("/api/auth/unlock")
async def unlock_device(request: Request):
    data = await request.json()
    fingerprint = data.get("fingerprint")
    result = auth.verify_user(fingerprint)
    return {"status": "unlocked" if result else "denied"}

@app.get("/api/hello")
def hello():
    return {"message": "Hello from FastAPI!"}


from fastapi import UploadFile, File, Form
from fastapi.responses import FileResponse
import os
import shutil
import sqlite3

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "documents")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/api/drafts")
def save_draft(id: str = Form(...), content: str = Form(...)):
    conn = sqlite3.connect("drafts.db")
    c = conn.cursor()
    c.execute("CREATE TABLE IF NOT EXISTS drafts (id TEXT PRIMARY KEY, content TEXT)")
    c.execute("REPLACE INTO drafts (id, content) VALUES (?, ?)", (id, content))
    conn.commit()
    conn.close()

    # Also save to documents folder
    with open(os.path.join(UPLOAD_DIR, f"{id}.txt"), "w", encoding="utf-8") as out:
        out.write(content)

    return {"status": "saved", "file": f"{id}.txt"}

@app.get("/api/drafts/{id}")
def load_draft(id: str):
    conn = sqlite3.connect("drafts.db")
    c = conn.cursor()
    c.execute("SELECT content FROM drafts WHERE id = ?", (id,))
    row = c.fetchone()
    conn.close()
    if row:
        return {"content": row[0]}
    return {"content": ""}

@app.post("/api/grammar-check")
async def grammar_check(text: str = Form(...)):
    from grammar_checker import check_grammar
    return {"corrections": check_grammar(text)}

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": file.filename}

@app.get("/api/files")
def list_files():
    return {"files": os.listdir(UPLOAD_DIR)}

@app.get("/api/download/{filename}")
def download_file(filename: str):
    path = os.path.join(UPLOAD_DIR, filename)
    return FileResponse(path, filename=filename)

@app.post("/api/journal/save")
async def save_journal(request: Request):
    data = await request.json()
    filename = data.get("filename")
    content = data.get("content")
    if not filename or content is None:
        raise HTTPException(status_code=400, detail="Filename and content are required")
    
    # Ensure the filename has .txt extension
    if not filename.endswith('.txt'):
        filename += '.txt'
    
    file_mgr.save_file(filename, content)
    return {"status": "saved", "filename": filename}

@app.post("/api/export/pdf")
async def export_to_pdf(request: Request):
    data = await request.json()
    filename = data.get("filename")
    content = data.get("content")
    if not filename or content is None:
        raise HTTPException(status_code=400, detail="Filename and content are required")
    
    # Ensure the filename has .pdf extension
    if not filename.endswith('.pdf'):
        filename += '.pdf'
    
    # Save the content as PDF in the documents folder
    pdf_path = os.path.join(UPLOAD_DIR, filename)
    try:
        from fpdf import FPDF
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        
        # Split content into lines and add to PDF
        for line in content.split('\n'):
            # Handle long lines by wrapping them
            if len(line) > 100:
                words = line.split()
                current_line = ""
                for word in words:
                    if len(current_line) + len(word) + 1 <= 100:
                        current_line += word + " "
                    else:
                        pdf.cell(200, 10, txt=current_line.strip(), ln=True)
                        current_line = word + " "
                if current_line:
                    pdf.cell(200, 10, txt=current_line.strip(), ln=True)
            else:
                pdf.cell(200, 10, txt=line, ln=True)
        
        pdf.output(pdf_path)
        
        # Return the file as a response
        return FileResponse(
            pdf_path,
            media_type='application/pdf',
            filename=filename
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create PDF: {str(e)}")

@app.get("/cloud-sync/status")
def get_sync_status():
    return {
        "synced": cloud.get_sync_status(),
        "authenticated": cloud.service is not None
    }

@app.post("/cloud-sync/toggle")
async def toggle_sync(request: Request):
    data = await request.json()
    enabled = data.get("enabled", False)
    cloud.toggle_sync(enabled)
    return {"synced": enabled}

@app.post("/cloud-sync/authenticate")
def authenticate():
    success = cloud.authenticate()
    return {"authenticated": success}

@app.post("/cloud-sync/upload/{filename:path}")
async def upload_to_drive(filename: str):
    if not cloud.service:
        raise HTTPException(status_code=401, detail="Not authenticated with Google Drive")
    
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    file_id = cloud.upload_file(file_path)
    if not file_id:
        raise HTTPException(status_code=500, detail="Failed to upload file to Google Drive")
    
    return {"file_id": file_id}

@app.get("/api/novel/load/{filename:path}")
async def load_novel_content(filename: str):
    print(f"Loading novel file: {filename}")  # Debug log
    
    # Ensure the filename has .txt extension
    if not filename.endswith('.txt'):
        filename += '.txt'
    
    try:
        # Try to load from the documents folder first
        file_path = os.path.join(UPLOAD_DIR, filename)
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            print(f"Loaded content length: {len(content)}")  # Debug log
            return {"content": content}
        
        # If not found in documents, try the file manager
        content = file_mgr.load_file(filename)
        if content == "":
            print(f"File not found: {filename}")  # Debug log
            raise HTTPException(status_code=404, detail="File not found")
        
        print(f"Loaded content length: {len(content)}")  # Debug log
        return {"content": content}
    except Exception as e:
        print(f"Error in load_novel_content: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=f"Failed to load file: {str(e)}")

@app.get("/api/journal/{day}")
def get_journal_entries(day: str):
    try:
        # Create directory for the day if it doesn't exist
        day_dir = os.path.join(UPLOAD_DIR, day.lower())
        os.makedirs(day_dir, exist_ok=True)
        
        # Get all entries for the day
        entries = []
        if os.path.exists(day_dir):
            for filename in os.listdir(day_dir):
                if filename.endswith('.txt'):
                    with open(os.path.join(day_dir, filename), 'r', encoding='utf-8') as f:
                        content = f.read()
                        entry_id = filename.replace('.txt', '')
                        entries.append({
                            'id': entry_id,
                            'title': f'Entry {len(entries) + 1}',
                            'content': content,
                            'date': os.path.getmtime(os.path.join(day_dir, filename))
                        })
        
        return {"entries": entries}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load journal entries: {str(e)}")

@app.post("/api/journal/save")
async def save_journal_entry(request: Request):
    data = await request.json()
    filename = data.get("filename")
    content = data.get("content")
    
    if not filename or content is None:
        raise HTTPException(status_code=400, detail="Filename and content are required")
    
    try:
        # Ensure the directory exists
        directory = os.path.dirname(os.path.join(UPLOAD_DIR, filename))
        os.makedirs(directory, exist_ok=True)
        
        # Save the file
        file_path = os.path.join(UPLOAD_DIR, filename)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return {"status": "saved", "filename": filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save journal entry: {str(e)}")

@app.delete("/api/journal/delete")
async def delete_journal_entry(request: Request):
    data = await request.json()
    filename = data.get("filename")
    
    if not filename:
        raise HTTPException(status_code=400, detail="Filename is required")
    
    try:
        file_path = os.path.join(UPLOAD_DIR, filename)
        if os.path.exists(file_path):
            os.remove(file_path)
            return {"status": "deleted"}
        else:
            raise HTTPException(status_code=404, detail="File not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete journal entry: {str(e)}")

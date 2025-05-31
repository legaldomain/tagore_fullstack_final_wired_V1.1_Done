# backend part
cd backend
pip install -r requirements.txt
# uvicorn is the hosting server
uvicorn main:app -- reload
# Visit http://localhost:8000/docs for API docs.


# front end part
cd frontend
npm run dev
Visit http://localhost:3000 to view the app.

 
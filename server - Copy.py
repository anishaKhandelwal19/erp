#!/usr/bin/env python3
"""
Student ERP: Placement & Peer Skill-Sharing Platform
Python Backend Server & API Persistence Engine
"""

import os
import sys
import json
import urllib.parse
import webbrowser
from http.server import HTTPServer, SimpleHTTPRequestHandler
from datetime import datetime

PORT = 8080
DB_FILE = os.path.join(os.path.dirname(__file__), 'database.json')
STATIC_DIR = os.path.dirname(__file__)

# Seed Data Initialization
def get_initial_seed_data():
    return {
        "users": [
            {
                "id": "usr_student1",
                "username": "student1",
                "password": "Student@123",
                "name": "Rohan Sharma",
                "studentId": "STU2025001",
                "email": "rohan.sharma@campus.edu",
                "programme": "MBA (Marketing)",
                "year": "2nd Year",
                "domain": "Marketing",
                "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                "bio": "Passionate about FMCG brand strategy and digital performance marketing.",
                "teachSkills": ["Consumer Behaviour", "Brand Management", "Digital Marketing", "SEO"],
                "learnSkills": ["Financial Modelling", "Power BI", "SQL", "Python"]
            },
            {
                "id": "usr_student2",
                "username": "student2",
                "password": "Student@456",
                "name": "Ananya Verma",
                "studentId": "STU2025002",
                "email": "ananya.verma@campus.edu",
                "programme": "MBA (Finance)",
                "year": "2nd Year",
                "domain": "Finance",
                "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
                "bio": "Finance specialist focusing on valuation and financial statement analysis.",
                "teachSkills": ["Financial Modelling", "Valuation", "Accounting", "Corporate Finance", "Excel"],
                "learnSkills": ["Python", "Data Analytics", "Digital Marketing"]
            },
            {
                "id": "usr_student3",
                "username": "student3",
                "password": "Student@789",
                "name": "Vikramaditya Singh",
                "studentId": "STU2025003",
                "email": "vikram.singh@campus.edu",
                "programme": "B.Tech (IT)",
                "year": "4th Year",
                "domain": "IT",
                "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                "bio": "Full-stack developer and cloud technology enthusiast.",
                "teachSkills": ["Python", "SQL", "Data Analytics", "Web Development", "Power BI"],
                "learnSkills": ["Public Speaking", "Case Solving", "Financial Modelling"]
            },
            {
                "id": "usr_student4",
                "username": "student4",
                "password": "Student@321",
                "name": "Priya Nair",
                "studentId": "STU2025004",
                "email": "priya.nair@campus.edu",
                "programme": "MBA (Human Resources)",
                "year": "2nd Year",
                "domain": "HR",
                "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
                "bio": "Human Resources enthusiast specializing in talent acquisition and HR analytics.",
                "teachSkills": ["Recruitment", "Talent Management", "Performance Management", "HR Analytics"],
                "learnSkills": ["Excel", "Power BI", "Presentation Skills"]
            },
            {
                "id": "usr_student5",
                "username": "student5",
                "password": "Student@654",
                "name": "Kabir Patel",
                "studentId": "STU2025005",
                "email": "kabir.patel@campus.edu",
                "programme": "MBA (Operations)",
                "year": "2nd Year",
                "domain": "Operations",
                "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
                "bio": "Supply chain and operations specialist focused on process optimization.",
                "teachSkills": ["Supply Chain Management", "Inventory Management", "Process Optimization", "Logistics"],
                "learnSkills": ["Performance Marketing", "Python", "Power BI"]
            }
        ],
        "skillRequests": [
            {
                "id": "req_101",
                "requesterId": "usr_student1",
                "requesterName": "Rohan Sharma",
                "requesterAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                "skillId": "skl_fin_model",
                "skillName": "Financial Modelling",
                "domain": "Finance",
                "status": "PENDING",
                "createdAt": "2026-08-25T10:30:00Z",
                "message": "Preparing for FMCG brand valuations and would love to learn 3-statement financial modeling.",
                "acceptedBy": None,
                "acceptedByName": None,
                "acceptedByAvatar": None,
                "acceptedAt": None
            },
            {
                "id": "req_102",
                "requesterId": "usr_student4",
                "requesterName": "Priya Nair",
                "requesterAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
                "skillId": "skl_power_bi",
                "skillName": "Power BI",
                "domain": "IT",
                "status": "ACCEPTED",
                "createdAt": "2026-08-24T14:15:00Z",
                "message": "Looking for guidance on DAX queries to build HR attrition dashboards.",
                "acceptedBy": "usr_student3",
                "acceptedByName": "Vikramaditya Singh",
                "acceptedByAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                "acceptedAt": "2026-08-24T16:00:00Z"
            }
        ],
        "messages": [
            {
                "id": "msg_1",
                "requestId": "req_102",
                "senderId": "usr_student4",
                "senderName": "Priya Nair",
                "message": "Hi Vikram! Thanks for accepting my Power BI request. When are you free this week?",
                "timestamp": "2026-08-24T16:05:00Z"
            },
            {
                "id": "msg_2",
                "requestId": "req_102",
                "senderId": "usr_student3",
                "senderName": "Vikramaditya Singh",
                "message": "Hey Priya! Thursday afternoon around 3:00 PM in Library Study Room 2 works for me.",
                "timestamp": "2026-08-24T16:12:00Z"
            }
        ],
        "sessions": [
            {
                "id": "ses_1",
                "requestId": "req_102",
                "requesterId": "usr_student4",
                "requesterName": "Priya Nair",
                "teacherId": "usr_student3",
                "teacherName": "Vikramaditya Singh",
                "skillId": "skl_power_bi",
                "skillName": "Power BI",
                "domain": "IT",
                "date": "2026-08-28",
                "time": "15:00",
                "venue": "Library Study Room 2",
                "notes": "DAX calculations for HR Attrition analytics.",
                "status": "SCHEDULED"
            }
        ],
        "notifications": [
            {
                "id": "notif_1",
                "userId": "usr_student4",
                "text": "Vikramaditya Singh accepted your request to learn Power BI.",
                "timestamp": "2026-08-24T16:00:00Z",
                "read": False,
                "type": "ACCEPTANCE"
            }
        ]
    }

def load_db():
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"[Warning] Failed to read database.json, resetting: {e}")
    db = get_initial_seed_data()
    save_db(db)
    return db

def save_db(data):
    try:
        with open(DB_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        print(f"[Error] Failed to save database.json: {e}")

class ERPBackendHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=STATIC_DIR, **kwargs)

    def _send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def do_OPTIONS(self):
        self._send_json({"status": "ok"})

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/api/state':
            db = load_db()
            self._send_json({"success": True, "data": db})
            return
        
        # Fallback to serving static HTML/CSS/JS files
        super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        content_length = int(self.headers.get('Content-Length', 0))
        body_str = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'
        
        try:
            payload = json.loads(body_str)
        except Exception:
            payload = {}

        db = load_db()

        if parsed.path == '/api/login':
            username = payload.get('username', '').strip().lower()
            password = payload.get('password', '')
            user = next((u for u in db['users'] if u['username'].lower() == username and u['password'] == password), None)
            if user:
                self._send_json({"success": True, "user": user})
            else:
                self._send_json({"success": False, "message": "Invalid Student ID or Password"}, status=401)
            return

        elif parsed.path == '/api/requests/accept':
            request_id = payload.get('requestId')
            user_id = payload.get('userId')
            
            user = next((u for u in db['users'] if u['id'] == user_id), None)
            req = next((r for r in db['skillRequests'] if r['id'] == request_id), None)

            if not req or not user:
                self._send_json({"success": False, "message": "Request or user not found"}, status=404)
                return

            if req['status'] == 'ACCEPTED':
                self._send_json({"success": False, "message": f"Already accepted by {req.get('acceptedByName', 'another peer')}"}, status=400)
                return

            # SINGLE ACCEPTANCE BUSINESS RULE ENGINE
            req['status'] = 'ACCEPTED'
            req['acceptedBy'] = user['id']
            req['acceptedByName'] = user['name']
            req['acceptedByAvatar'] = user['avatar']
            req['acceptedAt'] = datetime.utcnow().isoformat() + 'Z'

            # Notify Requester
            db['notifications'].insert(0, {
                "id": f"notif_{int(datetime.utcnow().timestamp())}",
                "userId": req['requesterId'],
                "text": f"{user['name']} accepted your request to learn {req['skillName']}!",
                "timestamp": datetime.utcnow().isoformat() + 'Z',
                "read": False,
                "type": "ACCEPTANCE"
            })

            # Automated intro message
            db['messages'].append({
                "id": f"msg_{int(datetime.utcnow().timestamp())}",
                "requestId": req['id'],
                "senderId": user['id'],
                "senderName": user['name'],
                "message": f"Hi {req['requesterName']}! I accepted your request for {req['skillName']}. Let's coordinate a session time!",
                "timestamp": datetime.utcnow().isoformat() + 'Z'
            })

            save_db(db)
            self._send_json({"success": True, "request": req})
            return

        elif parsed.path == '/api/chat/send':
            request_id = payload.get('requestId')
            sender_id = payload.get('senderId')
            text = payload.get('message', '').strip()

            user = next((u for u in db['users'] if u['id'] == sender_id), None)
            if not user or not text:
                self._send_json({"success": False, "message": "Invalid sender or empty message"}, status=400)
                return

            new_msg = {
                "id": f"msg_{int(datetime.utcnow().timestamp())}",
                "requestId": request_id,
                "senderId": user['id'],
                "senderName": user['name'],
                "message": text,
                "timestamp": datetime.utcnow().isoformat() + 'Z'
            }
            db['messages'].append(new_msg)
            save_db(db)
            self._send_json({"success": True, "message": new_msg})
            return

        self._send_json({"success": False, "message": "Unknown endpoint"}, status=404)

def run_server():
    print("============================================================")
    print("  Student ERP: Placement & Peer Skill-Sharing Platform   ")
    print("============================================================")
    print(f"  [Server] Running on: http://localhost:{PORT}")
    print(f"  [Server] Static files: {STATIC_DIR}")
    print(f"  [Server] Database file: {DB_FILE}")
    print("============================================================")
    
    server = HTTPServer(('0.0.0.0', PORT), ERPBackendHandler)
    
    try:
        webbrowser.open(f"http://localhost:{PORT}")
    except Exception:
        pass

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[Server] Shutting down...")
        server.server_close()

if __name__ == '__main__':
    run_server()

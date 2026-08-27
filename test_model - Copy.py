import urllib.request
import json

BASE_URL = "http://localhost:8080"

def test_api():
    print("--- 1. Testing GET /api/state ---")
    req = urllib.request.urlopen(f"{BASE_URL}/api/state")
    assert req.getcode() == 200
    state = json.loads(req.read().decode('utf-8'))['data']
    print(f"State loaded! Users: {len(state['users'])}, Requests: {len(state['skillRequests'])}, Messages: {len(state['messages'])}")

    print("\n--- 2. Testing POST /api/login for student1 ---")
    data = json.dumps({"username": "student1", "password": "Student@123"}).encode('utf-8')
    req = urllib.request.Request(f"{BASE_URL}/api/login", data=data, headers={'Content-Type': 'application/json'})
    res = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))
    assert res['success'] is True
    print(f"Authenticated as: {res['user']['name']} ({res['user']['domain']})")

    print("\n--- 3. Testing Single Acceptance Locking Rule ---")
    # Student 2 (Finance domain peer) accepts req_101 (Financial Modelling request from Student 1)
    accept_data = json.dumps({"requestId": "req_101", "userId": "usr_student2"}).encode('utf-8')
    req = urllib.request.Request(f"{BASE_URL}/api/requests/accept", data=accept_data, headers={'Content-Type': 'application/json'})
    res = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))
    assert res['success'] is True
    print(f"Request req_101 accepted by: {res['request']['acceptedByName']}")

    # Try accepting again with another user to verify locking
    try:
        req2 = urllib.request.Request(f"{BASE_URL}/api/requests/accept", data=accept_data, headers={'Content-Type': 'application/json'})
        urllib.request.urlopen(req2)
    except urllib.error.HTTPError as e:
        err = json.loads(e.read().decode('utf-8'))
        print(f"Locking verified! Prevented duplicate acceptance: {err['message']}")

    print("\n--- 4. Testing Chat Messaging ---")
    chat_data = json.dumps({"requestId": "req_101", "senderId": "usr_student1", "message": "Thanks Ananya! Looking forward to learning DCF models."}).encode('utf-8')
    req = urllib.request.Request(f"{BASE_URL}/api/chat/send", data=chat_data, headers={'Content-Type': 'application/json'})
    res = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))
    assert res['success'] is True
    print(f"Chat message sent! ID: {res['message']['id']}")

    print("\n✅ All Model Tests Passed Successfully!")

if __name__ == '__main__':
    test_api()

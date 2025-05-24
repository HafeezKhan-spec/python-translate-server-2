import requests
import json

def test_translation():
    url = "http://localhost:8000/translate"
    headers = {"Content-Type": "application/json"}
    data = {"text": "Hello, how are you?"}
    
    try:
        response = requests.post(url, headers=headers, json=data)
        print("Status Code:", response.status_code)
        print("Response:", response.json())
    except Exception as e:
        print("Error:", str(e))

if __name__ == "__main__":
    test_translation() 
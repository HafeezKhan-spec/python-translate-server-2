import requests
import sys

def test_translation():
    url = "http://localhost:8000/translate"
    text = "Hello, how are you?"
    
    print("Testing translation service...")
    print(f"Server URL: {url}")
    print(f"Test text: {text}")
    
    try:
        # First check if server is running
        health_url = "http://localhost:8000/health"
        print("\nChecking server health...")
        health_response = requests.get(health_url)
        print(f"Health check status: {health_response.status_code}")
        print(f"Health check response: {health_response.text}")
        
        # Now test translation
        print("\nTesting translation...")
        response = requests.post(url, json={"text": text})
        print(f"Translation status code: {response.status_code}")
        
        if response.status_code == 200:
            print("\nTranslation successful!")
            print(f"Original text: {text}")
            print(f"Translated text: {response.json()['translatedText']}")
        else:
            print("\nTranslation failed!")
            print(f"Error status: {response.status_code}")
            print(f"Error response: {response.text}")
    except requests.exceptions.ConnectionError:
        print("\nError: Could not connect to the server. Is it running?")
        print("Please make sure to run 'python app.py' in the python-translate-server directory")
    except Exception as e:
        print(f"\nError: {str(e)}")
        print(f"Error type: {type(e).__name__}")

if __name__ == "__main__":
    test_translation() 
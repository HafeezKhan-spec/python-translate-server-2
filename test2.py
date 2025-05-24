import requests

# Test the translation endpoint
response = requests.post(
    'http://localhost:8000/translate',
    json={'text': 'Hello, how are you?'}
)

print("Status Code:", response.status_code)
print("Response:", response.json()) 
import json
import os
import requests
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            resend_key = os.environ.get("RESEND_API_KEY")
            
            # Make direct HTTP request to Resend API
            url = "https://api.resend.com/emails"
            headers = {
                "Authorization": f"Bearer {resend_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "from": "onboarding@resend.dev",
                "to": ["tmille12@syr.edu"],
                "subject": "Direct API Test",
                "text": "Testing direct API call to Resend"
            }
            
            try:
                response = requests.post(url, headers=headers, json=payload, timeout=10)
                
                response_data = {
                    "status_code": response.status_code,
                    "headers": dict(response.headers),
                    "response_text": response.text,
                    "success": response.status_code == 200
                }
                
                if response.status_code != 200:
                    try:
                        error_json = response.json()
                        response_data["error_details"] = error_json
                    except:
                        response_data["error_details"] = "Could not parse error response"
                        
            except requests.RequestException as e:
                response_data = {
                    "request_error": str(e),
                    "error_type": type(e).__name__
                }
            
            # Also test with Resend library for comparison
            try:
                import resend
                resend.api_key = resend_key
                
                lib_result = resend.Emails.send({
                    "from": "onboarding@resend.dev",
                    "to": ["tmille12@syr.edu"],
                    "subject": "Library Test",
                    "text": "Testing with Resend library"
                })
                response_data["library_test"] = {
                    "status": "success",
                    "result": str(lib_result)
                }
            except Exception as lib_error:
                response_data["library_test"] = {
                    "status": "failed",
                    "error": str(lib_error),
                    "error_type": type(lib_error).__name__
                }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response_data, indent=2).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            error_response = {
                "status": "error",
                "error": str(e),
                "error_type": type(e).__name__
            }
            self.wfile.write(json.dumps(error_response).encode())
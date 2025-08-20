import json
import os
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Check Resend setup
            resend_key = os.environ.get("RESEND_API_KEY")
            
            response_data = {
                "resend_key_exists": bool(resend_key),
                "resend_key_length": len(resend_key) if resend_key else 0,
                "resend_key_prefix": resend_key[:5] if resend_key else None
            }
            
            # Try to import Resend
            try:
                import resend
                response_data["resend_import"] = "success"
                
                # Set API key
                resend.api_key = resend_key
                response_data["api_key_set"] = True
                
                # Try to send a test email
                try:
                    result = resend.Emails.send({
                        "from": "onboarding@resend.dev",
                        "to": "tmille12@syr.edu",
                        "subject": "Test Email from Portfolio",
                        "text": "This is a test email to verify Resend is working."
                    })
                    response_data["email_test"] = {
                        "status": "success",
                        "result": str(result)
                    }
                except Exception as email_error:
                    response_data["email_test"] = {
                        "status": "failed", 
                        "error": str(email_error),
                        "error_type": type(email_error).__name__
                    }
                    
            except Exception as import_error:
                response_data["resend_import"] = f"failed: {str(import_error)}"
            
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
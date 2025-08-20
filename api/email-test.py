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
                
                # Try different email formats
                tests = []
                
                # Test 1: Simple text email
                try:
                    result1 = resend.Emails.send({
                        "from": "onboarding@resend.dev",
                        "to": ["tmille12@syr.edu"],
                        "subject": "Test 1 - Portfolio Contact",
                        "text": "Simple test email"
                    })
                    tests.append({"test": "simple_text", "status": "success", "result": str(result1)})
                except Exception as e:
                    tests.append({"test": "simple_text", "status": "failed", "error": str(e)})
                
                # Test 2: Different from address format
                try:
                    result2 = resend.Emails.send(
                        from_email="onboarding@resend.dev",
                        to=["tmille12@syr.edu"],
                        subject="Test 2 - Portfolio Contact",
                        text="Alternative format test"
                    )
                    tests.append({"test": "alt_format", "status": "success", "result": str(result2)})
                except Exception as e:
                    tests.append({"test": "alt_format", "status": "failed", "error": str(e)})
                
                # Test 3: Very minimal
                try:
                    result3 = resend.Emails.send(
                        from_="onboarding@resend.dev",
                        to="tmille12@syr.edu", 
                        subject="Test 3",
                        text="Minimal test"
                    )
                    tests.append({"test": "minimal", "status": "success", "result": str(result3)})
                except Exception as e:
                    tests.append({"test": "minimal", "status": "failed", "error": str(e)})
                
                response_data["email_tests"] = tests
                    
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
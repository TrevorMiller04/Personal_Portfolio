import json
import os
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Check environment variables
            supabase_url = os.environ.get("SUPABASE_URL")
            supabase_key = os.environ.get("SUPABASE_ANON_KEY") 
            resend_key = os.environ.get("RESEND_API_KEY")
            
            response_data = {
                "supabase_url_exists": bool(supabase_url),
                "supabase_url_length": len(supabase_url) if supabase_url else 0,
                "supabase_key_exists": bool(supabase_key),
                "supabase_key_length": len(supabase_key) if supabase_key else 0,
                "resend_key_exists": bool(resend_key),
                "resend_key_length": len(resend_key) if resend_key else 0
            }
            
            # Try to import libraries
            try:
                from supabase import create_client, Client
                response_data["supabase_import"] = "success"
                
                if supabase_url and supabase_key:
                    supabase = create_client(supabase_url, supabase_key)
                    response_data["supabase_client"] = "created"
                else:
                    response_data["supabase_client"] = "missing_credentials"
                    
            except Exception as e:
                response_data["supabase_import"] = f"error: {str(e)}"
            
            try:
                import resend
                response_data["resend_import"] = "success"
            except Exception as e:
                response_data["resend_import"] = f"error: {str(e)}"
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response_data, indent=2).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())
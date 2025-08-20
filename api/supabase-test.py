import json
import os
from http.server import BaseHTTPRequestHandler
from supabase import create_client, Client

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Initialize Supabase
            supabase_url = os.environ.get("SUPABASE_URL")
            supabase_key = os.environ.get("SUPABASE_ANON_KEY")
            supabase: Client = create_client(supabase_url, supabase_key)
            
            # Try to insert test data
            test_data = {
                'name': 'Test User From API',
                'email': 'test@example.com', 
                'message': 'This is a test message from the Vercel function'
            }
            
            try:
                result = supabase.table('contacts').insert(test_data).execute()
                
                response = {
                    "status": "success",
                    "message": "Test record inserted successfully",
                    "result": str(result.data),
                    "count": len(result.data) if result.data else 0
                }
                
            except Exception as insert_error:
                response = {
                    "status": "insert_failed",
                    "error": str(insert_error),
                    "error_type": type(insert_error).__name__,
                    "test_data": test_data
                }
            
            # Try to read from table
            try:
                records = supabase.table('contacts').select("*").limit(5).execute()
                response["read_test"] = {
                    "status": "success",
                    "record_count": len(records.data) if records.data else 0,
                    "sample_records": records.data[:2] if records.data else []
                }
            except Exception as read_error:
                response["read_test"] = {
                    "status": "failed",
                    "error": str(read_error)
                }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response, indent=2).encode())
            
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
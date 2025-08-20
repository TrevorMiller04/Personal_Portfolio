import json
import os
from http.server import BaseHTTPRequestHandler
from supabase import create_client, Client
import resend

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Initialize services
            resend.api_key = os.environ.get("RESEND_API_KEY")
            supabase_url = os.environ.get("SUPABASE_URL")
            supabase_key = os.environ.get("SUPABASE_ANON_KEY")
            supabase: Client = create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None
            
            # Read request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            body = json.loads(post_data.decode('utf-8'))
            
            name = body.get('name', '').strip()
            email = body.get('email', '').strip()
            message = body.get('message', '').strip()
            
            # Validate input
            if not all([name, email, message]):
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'All fields are required'}).encode())
                return
            
            if len(message) < 10:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Message must be at least 10 characters'}).encode())
                return
            
            # Store in Supabase
            if supabase:
                try:
                    supabase.table('contacts').insert({
                        'name': name,
                        'email': email,
                        'message': message
                    }).execute()
                except Exception as e:
                    print(f"Supabase error: {e}")
            
            # Send email via Resend
            if resend.api_key:
                try:
                    resend.Emails.send({
                        "from": "onboarding@resend.dev",
                        "to": "tmille12@syr.edu",
                        "subject": f"Portfolio Contact: {name}",
                        "html": f"""
                        <h2>New Portfolio Contact</h2>
                        <p><strong>Name:</strong> {name}</p>
                        <p><strong>Email:</strong> {email}</p>
                        <p><strong>Message:</strong></p>
                        <p>{message}</p>
                        """
                    })
                except Exception as e:
                    print(f"Resend error: {e}")
            
            # Send success response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True, 'message': 'Message sent successfully!'}).encode())
            
        except Exception as e:
            print(f"Error: {e}")
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Internal server error'}).encode())
    
    def do_OPTIONS(self):
        # Handle CORS preflight
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
import json
import os
from http.server import BaseHTTPRequestHandler
from supabase import create_client, Client
import resend
from openai import OpenAI

def generate_ai_reply(name, email, message):
    """Generate an AI-suggested reply using OpenAI's API"""
    try:
        openai_api_key = os.environ.get("OPENAI_API_KEY")
        if not openai_api_key:
            print("No OpenAI API key found in environment")
            return "[AI reply generation unavailable - no API key configured]"
        
        print(f"OpenAI API key exists, length: {len(openai_api_key)}")
        
        client = OpenAI(api_key=openai_api_key)
        print("OpenAI client created successfully")
        
        prompt = f"""Write a complete email reply for this portfolio contact form submission.

Guidelines:
- Tone: warm, concise, helpful
- Include one concrete next step or question
- If spam-like, start with "[Potential spam — review before sending]"
- Never invent facts or commit to specific dates/times
- No signature block needed

Contact details:
Name: {name}
Email: {email}
Message: {message}

Write the complete email reply (not just suggestions):"""

        print("About to make OpenAI API call...")
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are Trevor Miller's professional email assistant. Generate a direct, actionable email reply."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.7
        )
        
        print(f"OpenAI API call successful, response received")
        reply_content = response.choices[0].message.content.strip()
        print(f"Reply content length: {len(reply_content)}")
        return reply_content
    
    except Exception as e:
        print(f"OpenAI API error: {e}")
        error_str = str(e)
        
        # Handle specific error types with user-friendly messages
        if "429" in error_str or "quota" in error_str.lower():
            return "[AI reply generation temporarily unavailable due to quota limits. Please check your OpenAI usage.]"
        elif "401" in error_str or "authentication" in error_str.lower():
            return "[AI reply generation failed due to authentication error. Please check your OpenAI API key.]"
        else:
            return f"[AI reply generation failed: {error_str[:100]}...]"

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
            supabase_success = False
            if supabase:
                try:
                    print(f"Attempting to insert: name={name}, email={email}, message_length={len(message)}")
                    result = supabase.table('contacts').insert({
                        'name': name,
                        'email': email,
                        'message': message
                    }).execute()
                    print(f"Supabase insert result: {result}")
                    supabase_success = True
                except Exception as e:
                    print(f"Supabase error: {e}")
                    print(f"Error type: {type(e).__name__}")
            else:
                print("Supabase client not initialized")
            
            # Generate AI-suggested reply
            print("Generating AI-suggested reply...")
            ai_reply = generate_ai_reply(name, email, message)
            print(f"AI reply result: {ai_reply}")
            
            # Ensure we have a valid AI reply
            if not ai_reply or ai_reply.strip() == "":
                ai_reply = "[AI reply generation returned empty result]"
            
            # Send email via Resend
            email_success = False
            email_error = None
            if resend.api_key:
                try:
                    print(f"Attempting to send email to trevormiller68@icloud.com")
                    
                    # Get recipient email from environment or use default
                    recipient_email = os.environ.get("RESEND_TO", "trevormiller68@icloud.com")
                    from_email = os.environ.get("RESEND_FROM", "onboarding@resend.dev")
                    
                    email_result = resend.Emails.send({
                        "from": from_email,
                        "to": recipient_email,
                        "reply_to": email,  # Set Reply-To to sender's email
                        "subject": f"Portfolio Contact: {name}",
                        "html": f"""<h2>New Portfolio Contact</h2>
<p><strong>Name:</strong> {name}</p>
<p><strong>Email:</strong> {email}</p>
<p><strong>Message:</strong></p>
<div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #0077B6; margin: 10px 0;">
    {message.replace('\n', '<br>').replace('\r', '')}
</div>

<hr style="margin: 30px 0; border: none; height: 1px; background-color: #ddd;">

<h3 style="color: #0077B6;">💡 AI-Suggested Reply</h3>
<div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; border: 1px solid #e0e8f0;">
    {ai_reply.replace('\n', '<br>').replace('\r', '')}
</div>

<p style="font-size: 12px; color: #666; margin-top: 20px;">
    <em>Reply directly to this email to respond to {name}. The AI suggestion is provided for your convenience and should be reviewed before sending.</em>
</p>"""
                    })
                    print(f"Email sent successfully: {email_result}")
                    email_success = True
                except Exception as e:
                    email_error = str(e)
                    print(f"Resend error: {e}")
                    print(f"Error type: {type(e).__name__}")
            else:
                email_error = "No Resend API key configured"
                print("No Resend API key found")
            
            # Send success response with debug info
            response_data = {
                'success': True, 
                'message': 'Message sent successfully!',
                'debug': {
                    'supabase_success': supabase_success,
                    'supabase_initialized': bool(supabase),
                    'email_success': email_success,
                    'email_error': email_error,
                    'resend_api_key_exists': bool(resend.api_key),
                    'openai_api_key_exists': bool(os.environ.get("OPENAI_API_KEY")),
                    'ai_reply_preview': ai_reply[:100] + "..." if len(ai_reply) > 100 else ai_reply,
                    'form_data_received': {'name': name, 'email': email, 'message_length': len(message)}
                }
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode())
            
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
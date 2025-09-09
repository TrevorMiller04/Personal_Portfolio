import json
import os
from http.server import BaseHTTPRequestHandler
from supabase import create_client, Client
import resend
import anthropic

def generate_ai_reply(name, email, message):
    """Generate an AI-suggested reply using Claude's API"""
    try:
        claude_api_key = os.environ.get("ANTHROPIC_API_KEY")
        if not claude_api_key:
            print("No Anthropic API key found in environment")
            return "[AI reply generation unavailable - no API key configured]"
        
        print(f"Anthropic API key exists, length: {len(claude_api_key)}")
        
        client = anthropic.Anthropic(api_key=claude_api_key)
        print("Claude client created successfully")
        
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

        print("About to make Claude API call...")
        
        response = client.messages.create(
            model="claude-3-5-haiku-20241022",
            max_tokens=300,
            temperature=0.7,
            system="You are Trevor Miller's professional email assistant. Generate a direct, actionable email reply.",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        print(f"Claude API call successful, response received")
        reply_content = response.content[0].text.strip()
        print(f"Reply content length: {len(reply_content)}")
        return reply_content
    
    except Exception as e:
        print(f"Claude API error: {e}")
        error_str = str(e)
        
        # Handle specific error types with user-friendly messages
        if "429" in error_str or "rate_limit" in error_str.lower():
            return "[AI reply generation temporarily unavailable due to rate limits. Please try again in a moment.]"
        elif "401" in error_str or "authentication" in error_str.lower() or "invalid" in error_str.lower():
            return "[AI reply generation failed due to authentication error. Please check your Anthropic API key.]"
        else:
            return f"[AI reply generation failed: {error_str[:100]}...]"

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Initialize services
            resend.api_key = os.environ.get("RESEND_API_KEY")
            supabase_url = os.environ.get("SUPABASE_URL")
            supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
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
                    # Get email configuration from environment variables
                    recipient_email = os.environ.get("RESEND_TO", "tmille12@syr.edu")
                    from_email = os.environ.get("RESEND_FROM", "Trevor Miller <notify@trevormiller.xyz>")
                    
                    print(f"Email config - From: {from_email}, To: {recipient_email}")
                    print(f"Attempting to send email via Resend...")
                    
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
                    'anthropic_api_key_exists': bool(os.environ.get("ANTHROPIC_API_KEY")),
                    'email_config': {
                        'from': os.environ.get("RESEND_FROM", "Trevor Miller <notify@trevormiller.xyz>"),
                        'to': os.environ.get("RESEND_TO", "tmille12@syr.edu")
                    },
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
import json
import os
from flask import Flask, request, jsonify
from supabase import create_client, Client
import resend

app = Flask(__name__)

# Initialize services
resend.api_key = os.environ.get("RESEND_API_KEY")
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_ANON_KEY")
supabase: Client = create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None

def handler(event, context):
    """Vercel serverless function handler"""
    if event['httpMethod'] != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        # Parse request body
        body = json.loads(event['body'])
        name = body.get('name', '').strip()
        email = body.get('email', '').strip()
        message = body.get('message', '').strip()
        
        # Validate input
        if not all([name, email, message]):
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'All fields are required'})
            }
        
        if len(message) < 10:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Message must be at least 10 characters'})
            }
        
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
                    "from": "portfolio@trevormiller.dev",
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
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'success': True, 'message': 'Message sent successfully!'})
        }
        
    except Exception as e:
        print(f"Error: {e}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Internal server error'})
        }
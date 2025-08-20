import os, json, requests
from flask import Flask, request, jsonify
import resend

app = Flask(__name__)

# Env (set in Vercel)
RESEND_API_KEY = os.environ.get("RESEND_API_KEY")
RESEND_FROM     = os.environ.get("RESEND_FROM")
RESEND_TO       = os.environ.get("RESEND_TO")
RESEND_REPLY_TO = os.environ.get("RESEND_REPLY_TO")
SUPABASE_URL    = os.environ.get("SUPABASE_URL")
SUPABASE_KEY    = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

resend.api_key = RESEND_API_KEY

def store_in_supabase(name, email, message):
  # Use Supabase REST (PostgREST)
  url = f"{SUPABASE_URL}/rest/v1/contact_submissions"
  headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  }
  payload = {"name": name, "email": email, "message": message, "status": "new"}
  r = requests.post(url, headers=headers, data=json.dumps(payload), timeout=10)
  r.raise_for_status()
  return r.json()

def notify_via_resend(name, email, message):
  subject = f"New portfolio contact from {name}"
  html = f"""
    <div style="font-family:Inter,system-ui">
      <h2 style="margin:0 0 8px">New Portfolio Contact</h2>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Message:</strong><br/>{message.replace(chr(10), '<br/>')}</p>
    </div>
  """
  return resend.Emails.send({
    "from": RESEND_FROM,
    "to": [RESEND_TO],
    "reply_to": RESEND_REPLY_TO,
    "subject": subject,
    "html": html
  })

@app.route("/api/contact", methods=["POST"])
def contact():
  data = request.get_json(silent=True) or {}
  name   = (data.get("name") or "").strip()
  email  = (data.get("email") or "").strip()
  message= (data.get("message") or "").strip()

  if not name or not email or not message or len(message) < 10:
    return jsonify({"ok": False, "error": "validation"}), 400

  try:
    store_in_supabase(name, email, message)
  except Exception as e:
    return jsonify({"ok": False, "error": "storage"}), 500

  try:
    notify_via_resend(name, email, message)
  except Exception as e:
    return jsonify({"ok": False, "error": "email"}), 502

  return jsonify({"ok": True}), 200

# Vercel handler
def handler(request):
  with app.request_context(request.environ):
    return app.full_dispatch_request()
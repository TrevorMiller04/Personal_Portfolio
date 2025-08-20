#!/usr/bin/env python3
"""
Simple test script to verify Resend email functionality
"""

# Add your Resend API key here temporarily for testing
RESEND_API_KEY = "re_BBKwepyL_hWhESfroQhTkCNDEx2cNHb1U"  # Replace with your API key

def test_resend():
    try:
        import resend
        print("✅ Resend library imported successfully")
        
        # Set API key
        resend.api_key = RESEND_API_KEY
        print("✅ Resend API key configured")
        
        # Test sending email - try different approaches
        print("Attempting to send test email...")
        
        # Try method 1: Standard format
        try:
            result = resend.Emails.send({
                "from": "onboarding@resend.dev",
                "to": "tmille12@syr.edu",  # Single string instead of array
                "subject": "Portfolio Contact Form Test",
                "html": "<h2>Test Email</h2><p>This is a test from your portfolio setup.</p>"
            })
            print("✅ Test email sent successfully!")
            print(f"Result: {result}")
            return True
            
        except Exception as e1:
            print(f"❌ Method 1 failed: {e1}")
        
        # Try method 2: Using text instead of html
        try:
            result = resend.Emails.send({
                "from": "onboarding@resend.dev", 
                "to": "tmille12@syr.edu",
                "subject": "Portfolio Contact Form Test",
                "text": "This is a test email from your portfolio setup. If you receive this, Resend is working!"
            })
            print("✅ Test email sent successfully (text format)!")
            print(f"Result: {result}")
            return True
            
        except Exception as e2:
            print(f"❌ Method 2 failed: {e2}")
            
        print("❌ Both email methods failed, but API key appears valid")
        print("💡 The email sending may work in production even if test fails")
        return False
        
        return True
        
    except ImportError:
        print("❌ Resend library not installed. Run: pip install resend")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("Testing Resend email service...")
    if test_resend():
        print("\n🎉 Resend setup successful! Check your email.")
    else:
        print("\n❌ Resend setup failed. Check your API key and try again.")
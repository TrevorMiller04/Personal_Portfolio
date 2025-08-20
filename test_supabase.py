#!/usr/bin/env python3
"""
Simple test script to verify Supabase connection
"""

import os
import sys

# Add your Supabase credentials here temporarily for testing
SUPABASE_URL = "https://lizwfkhvmzooxhhbqzke.supabase.co"  # Replace with your Project URL
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxpendma2h2bXpvb3hoaGJxemtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NjQ5MjYsImV4cCI6MjA3MTI0MDkyNn0.n4jtu_tBFDKCVZzydt7-vxYIm8Os7TtUH20-hjVBkZE"    # Replace with your anon public key

def test_supabase():
    try:
        from supabase import create_client, Client
        print("✅ Supabase library imported successfully")
        
        # Create client
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Supabase client created")
        
        # Test connection by inserting a test record
        test_data = {
            "name": "Test User", 
            "email": "test@example.com",
            "message": "This is a test message from the setup script"
        }
        
        result = supabase.table('contacts').insert(test_data).execute()
        print("✅ Test record inserted successfully!")
        print(f"Record ID: {result.data[0]['id']}")
        
        # Test reading records
        records = supabase.table('contacts').select("*").execute()
        print(f"✅ Found {len(records.data)} records in contacts table")
        
        return True
        
    except ImportError:
        print("❌ Supabase library not installed. Run: pip install supabase")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("Testing Supabase connection...")
    if test_supabase():
        print("\n🎉 Supabase setup successful!")
    else:
        print("\n❌ Supabase setup failed. Check your credentials and try again.")
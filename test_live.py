import urllib.request
import sys
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

def test_url(url, expected_status, check_string=None):
    print(f"Testing {url}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    
    try:
        # Avoid following redirects automatically for the redirect test
        class NoRedirectHandler(urllib.request.HTTPRedirectHandler):
            def http_error_302(self, req, fp, code, msg, headers):
                return urllib.response.addinfourl(fp, headers, req.get_full_url(), code)
            http_error_301 = http_error_303 = http_error_307 = http_error_302

        opener = urllib.request.build_opener(NoRedirectHandler())
        response = opener.open(req)
        status = response.getcode()
        
        if status != expected_status:
            print(f"❌ FAILED: Expected status {expected_status}, got {status}")
            return False
            
        if check_string:
            content = response.read().decode('utf-8')
            if check_string not in content:
                print(f"❌ FAILED: Could not find '{check_string}' in the response body.")
                return False
                
        print(f"✅ PASSED: {url}")
        return True
        
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False

print("Starting Live Tests...")
success = True

# 1. Test the redirect
success &= test_url("https://trainaitogain-50c19.web.app/wali", 301)

# 2. Test the main page has the global tracker
success &= test_url("https://trainaitogain-50c19.web.app/", 200, "Global Affiliate Tracker")

# 3. Test the lead magnet page has the global tracker
success &= test_url("https://trainaitogain-50c19.web.app/experts-guide", 200, "Global Affiliate Tracker")

# 4. Test a marketing/job board page has the global tracker
success &= test_url("https://trainaitogain-50c19.web.app/role-finance", 200, "Global Affiliate Tracker")

if success:
    print("\n🎉 ALL TESTS PASSED! The site is fully functional.")
else:
    print("\n⚠️ SOME TESTS FAILED.")

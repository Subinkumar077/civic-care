# WhatsApp Notification Setup Guide

## 🚀 Complete Setup for Free WhatsApp Notifications

### Step 1: Twilio Account Setup

1. **Sign up/Login to Twilio**:
   - Go to https://www.twilio.com/
   - Use your existing account or create a new one
   - Navigate to the Console Dashboard

2. **Get Your Credentials**:
   - Find your **Account SID** and **Auth Token** in the dashboard
   - Copy these values (you'll need them for .env file)

### Step 2: WhatsApp Sandbox Setup (FREE)

1. **Enable WhatsApp Sandbox**:
   - In Twilio Console, go to **Messaging** → **Try it out** → **Send a WhatsApp message**
   - Or directly visit: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
   
2. **Get Sandbox Number**:
   - You'll see a sandbox WhatsApp number (e.g., `+1 415 523 8886`)
   - This is your `VITE_TWILIO_WHATSAPP_NUMBER`

3. **Join Sandbox** (Important):
   - Send the join code (e.g., "join <code>") to the sandbox number from your WhatsApp
   - Do this for both your phone and admin phone numbers
   - Without joining, messages won't be delivered

### Step 3: Environment Configuration

Update your `.env` file with these values:

```env
# Twilio Configuration
VITE_TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_TWILIO_AUTH_TOKEN=your_auth_token_here
VITE_TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
VITE_TWILIO_PHONE_NUMBER=+1xxxxxxxxxx
VITE_ADMIN_PHONE_NUMBER=+91xxxxxxxxxx
```

### Step 4: Phone Number Format

Ensure phone numbers are in international format:
- ✅ Correct: `+91xxxxxxxxxx` (India)
- ✅ Correct: `+1xxxxxxxxxx` (US)
- ❌ Wrong: `xxxxxxxxxx` (missing country code)

### Step 5: Test the Setup

1. **Go to Admin Dashboard**
2. **Scroll to "Notification Settings"**
3. **Enter your phone number**
4. **Click "Test WhatsApp"**
5. **Check your WhatsApp for the test message**

### Step 6: Production Setup (Optional)

For production use (after free tier):

1. **WhatsApp Business API**:
   - Apply for WhatsApp Business API approval
   - Get your business verified
   - Use approved message templates

2. **Dedicated Phone Number**:
   - Purchase a Twilio phone number
   - Use for SMS fallback

## 🎯 Features Included

### Automatic Notifications

**When Issue is Created**:
- ✅ User gets confirmation WhatsApp/SMS
- ✅ Admin gets new issue alert
- ✅ Includes issue details, location, priority

**When Status Changes**:
- ✅ User gets progress updates
- ✅ Admin gets status change notifications
- ✅ Automatic messages for: assigned, in_progress, resolved

**When Issue is Assigned**:
- ✅ User notified about assignment
- ✅ Includes assignee details and department

### Message Templates

**User Notifications**:
```
🚨 New Issue Reported

📋 Issue: Pothole on Main Street
📍 Location: 123 Main Street, City
🏷️ Category: Roads & Transportation
⚡ Priority: High
📅 Reported: 17/09/2025

Issue ID: 12345678...

We'll keep you updated on the progress!
```

**Admin Notifications**:
```
🔔 Admin Alert

🚨 New Issue Reported
[Same details as user]

Reporter: John Doe
Contact: +91xxxxxxxxxx

Please review and assign if needed.
```

## 💰 Cost Breakdown

### Free Tier (Twilio):
- **1,000 messages/month FREE**
- **WhatsApp**: $0.005 per message after free tier
- **SMS**: $0.0075 per message after free tier

### Estimated Monthly Cost:
- **Small City (100 issues/month)**: FREE
- **Medium City (500 issues/month)**: ~$2-3/month
- **Large City (2000 issues/month)**: ~$10-15/month

## 🔧 Troubleshooting

### Common Issues:

1. **Messages not delivered**:
   - Check if phone numbers joined the sandbox
   - Verify phone number format (+country code)
   - Check Twilio logs in console

2. **"Failed to send" errors**:
   - Verify Account SID and Auth Token
   - Check internet connection
   - Ensure sandbox is active

3. **SMS fallback not working**:
   - Add VITE_TWILIO_PHONE_NUMBER to .env
   - Purchase a Twilio phone number if needed

### Testing Checklist:

- [ ] Twilio credentials added to .env
- [ ] Phone numbers in international format
- [ ] Joined WhatsApp sandbox
- [ ] Test notifications working
- [ ] Admin phone number configured
- [ ] Database notifications table created

## 🚀 Next Steps

1. **Run the database migration** (`create-notifications-table.sql`)
2. **Update your .env file** with Twilio credentials
3. **Join the WhatsApp sandbox**
4. **Test notifications** in admin dashboard
5. **Create a test issue** to verify end-to-end flow

## 📱 Alternative: Telegram Bot (100% Free)

If you prefer a completely free solution, I can also implement Telegram notifications:
- Unlimited messages
- Rich formatting support
- File attachments
- No phone number required

Let me know if you'd like the Telegram implementation instead!
// Chatbot Service for Civic Platform
// Handles FAQ responses and conversation logic

export class ChatbotService {
  constructor() {
    this.faqDatabase = {
      // Greetings & General
      greetings: {
        keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
        responses: [
          "Hello! 👋 Welcome to Civicare. I'm CiviBot, your civic assistant. How can I help you report or track community issues today?",
          "Hi there! 👋 I'm here to help you navigate our civic reporting platform. What would you like to know?",
          "Welcome to Civicare! 🏛️ I can help you with reporting issues, tracking progress, and using our platform. What's on your mind?"
        ]
      },

      help: {
        keywords: ['help', 'assist', 'support', 'guide'],
        response: "I'm here to help! 🤝 I can assist you with:\n\n📝 **Reporting Issues**\n• How to submit reports\n• Required information\n• Photo guidelines\n\n📊 **Tracking Progress**\n• Check report status\n• Understanding updates\n• Notification settings\n\n👤 **Account Management**\n• Login/signup help\n• Profile updates\n• Password reset\n\n🌟 **Platform Features**\n• Available categories\n• Mobile app usage\n• Community features\n\nWhat would you like to know more about?"
      },

      // Issue Reporting
      reporting: {
        keywords: ['report', 'submit', 'file', 'complaint', 'issue', 'problem'],
        response: "📝 **How to Report a Civic Issue:**\n\n**Step 1:** Click 'Report Issue' or visit /issue-reporting-form\n\n**Step 2:** Fill in details:\n• Clear, descriptive title\n• Detailed description\n• Exact location/address\n• Select appropriate category\n\n**Step 3:** Add evidence (optional but helpful):\n• Photos of the issue\n• Additional context\n\n**Step 4:** Submit and get your reference ID\n\n**Step 5:** Receive WhatsApp confirmation\n\n💡 **Pro Tips:**\n• Be specific in descriptions\n• Include landmarks for location\n• Add photos for faster resolution\n• Provide your phone number for updates"
      },

      categories: {
        keywords: ['category', 'categories', 'type', 'types', 'what can i report'],
        response: "📋 **Issue Categories Available:**\n\n🚗 **Roads & Traffic**\n• Potholes, road damage\n• Traffic signal issues\n• Road signs, markings\n\n🗑️ **Sanitation & Cleanliness**\n• Garbage collection\n• Public toilet issues\n• Littering, dumping\n\n⚡ **Utilities**\n• Water supply problems\n• Electricity issues\n• Gas line problems\n\n🏗️ **Infrastructure**\n• Building maintenance\n• Bridge repairs\n• Public facility issues\n\n🛡️ **Safety & Security**\n• Street lighting\n• Broken equipment\n• Safety hazards\n\n🌱 **Environment**\n• Tree cutting/planting\n• Pollution issues\n• Park maintenance\n\nWhich category matches your issue?"
      },

      photos: {
        keywords: ['photo', 'image', 'picture', 'upload', 'attach'],
        response: "📸 **Photo Guidelines for Reports:**\n\n**✅ Good Photos:**\n• Clear, well-lit images\n• Show the full problem\n• Include surrounding context\n• Multiple angles if helpful\n\n**📱 Tips:**\n• Use good lighting (daylight preferred)\n• Keep camera steady\n• Get close-up and wide shots\n• Include street signs/landmarks\n\n**📏 Requirements:**\n• Max 5 photos per report\n• JPG, PNG formats supported\n• Max 10MB per image\n• No personal information visible\n\n**🚫 Avoid:**\n• Blurry or dark photos\n• Photos with people's faces\n• Irrelevant images\n• Screenshots of other apps\n\nGood photos help resolve issues faster! 🚀"
      },

      // Account & Authentication
      login: {
        keywords: ['login', 'sign in', 'password', 'forgot password', 'access'],
        response: "🔐 **Account Access Help:**\n\n**To Sign In:**\n1. Click 'Sign In' in the top menu\n2. Enter your email and password\n3. Click 'Sign In' button\n\n**Forgot Password?**\n1. Click 'Forgot Password' on login page\n2. Enter your email address\n3. Check email for reset link\n4. Follow instructions to reset\n\n**Demo Accounts (for testing):**\n• **Citizen:** citizen@civic.gov / citizen123\n• **Admin:** admin@civic.gov / admin123\n\n**Having Issues?**\n• Clear browser cache\n• Try incognito/private mode\n• Check email spelling\n• Contact support if still stuck\n\nNeed help with something specific? 🤔"
      },

      signup: {
        keywords: ['signup', 'sign up', 'register', 'create account', 'new account'],
        response: "📝 **Creating Your Account:**\n\n**Required Information:**\n• Full name\n• Email address\n• Phone number (for WhatsApp updates)\n• Secure password\n• Account type (Citizen/Department Manager)\n\n**Steps:**\n1. Click 'Sign Up' in the menu\n2. Fill in all required fields\n3. Choose your role:\n   • **Citizen:** Report and track issues\n   • **Dept. Manager:** Manage departmental issues\n4. Verify your email\n5. Start reporting!\n\n**📱 Why Phone Number?**\n• Get WhatsApp updates on your reports\n• Faster communication\n• Status change notifications\n\n**🔒 Privacy:**\n• Your data is secure\n• Phone used only for updates\n• No spam or marketing calls\n\nReady to create your account? 🚀"
      },

      // Tracking & Status
      tracking: {
        keywords: ['track', 'status', 'progress', 'update', 'check report'],
        response: "📊 **Track Your Reports:**\n\n**How to Check Status:**\n1. Log in to your account\n2. Go to 'My Reports' or Dashboard\n3. View real-time status updates\n4. Get detailed progress information\n\n**📈 Status Meanings:**\n🔵 **Submitted** - Report received, under review\n🟡 **In Review** - Being evaluated by team\n🟣 **Assigned** - Team/department assigned\n🟠 **In Progress** - Work has started\n🟢 **Resolved** - Issue has been fixed\n⚫ **Closed** - Process completed\n🔴 **Rejected** - Not a valid civic issue\n\n**📱 Notifications:**\n• WhatsApp updates for major changes\n• Email notifications\n• In-app alerts\n\n**⏱️ Typical Timeline:**\n• Review: 1-2 business days\n• Assignment: 2-5 business days\n• Resolution: Varies by issue complexity\n\nNeed help with a specific report? 🤔"
      },

      notifications: {
        keywords: ['notification', 'whatsapp', 'sms', 'alert', 'message'],
        response: "🔔 **Notification System:**\n\n**📱 WhatsApp Updates:**\n• Report submission confirmation\n• Status change notifications\n• Resolution updates\n• Important announcements\n\n**📧 Email Notifications:**\n• Weekly progress summaries\n• Account-related updates\n• System maintenance alerts\n\n**🔔 In-App Alerts:**\n• Real-time status changes\n• New comments/updates\n• System notifications\n\n**⚙️ Manage Notifications:**\n1. Go to Profile Settings\n2. Choose notification preferences\n3. Update phone number if needed\n4. Select notification types\n\n**📞 Phone Number Issues?**\n• Update in profile settings\n• Ensure correct country code (+91 for India)\n• Verify WhatsApp is installed\n• Check if number is active\n\n**🚫 Not Getting Notifications?**\n• Check spam/junk folders\n• Verify phone number format\n• Ensure WhatsApp is working\n• Contact support for help"
      },

      // Platform Features
      features: {
        keywords: ['features', 'what can i do', 'capabilities', 'functions'],
        response: "🌟 **Civicare Platform Features:**\n\n**📱 Core Features:**\n• Mobile-friendly issue reporting\n• Photo upload with GPS location\n• Real-time status tracking\n• WhatsApp/SMS notifications\n• Community voting on issues\n\n**🗺️ Interactive Map:**\n• View issues in your area\n• Filter by category/status\n• See resolution patterns\n• Find nearby problems\n\n**👥 Community Features:**\n• Vote on issue importance\n• Add comments/updates\n• Follow issue progress\n• Share reports with others\n\n**📊 Analytics & Insights:**\n• Personal report dashboard\n• Area-wise statistics\n• Resolution time tracking\n• Community impact metrics\n\n**🔐 Account Management:**\n• Secure login system\n• Profile customization\n• Notification preferences\n• Report history\n\n**🏛️ Admin Features:**\n• Issue assignment system\n• Bulk status updates\n• Department coordination\n• Progress analytics\n\nWhich feature interests you most? 🤔"
      },

      // Contact & Support
      contact: {
        keywords: ['contact', 'support', 'phone', 'email', 'help desk'],
        response: "📞 **Contact & Support:**\n\n**🏛️ Civicare Support Team:**\n• **Email:** support@civicare.gov\n• **Phone:** +91-11-2345-6789\n• **Hours:** 9:00 AM - 6:00 PM (Mon-Fri)\n• **Response Time:** Within 24 hours\n\n**🚨 For Emergencies:**\n• **Police:** 100\n• **Fire:** 101\n• **Ambulance:** 108\n• **Disaster Management:** 1078\n\n**💬 Other Ways to Reach Us:**\n• Live chat (this bot!)\n• Social media @CivicareIndia\n• Community forums\n• Feedback form on website\n\n**🛠️ Technical Issues:**\n• Describe the problem clearly\n• Include screenshots if possible\n• Mention browser/device type\n• Note any error messages\n\n**📝 Before Contacting:**\n• Check this FAQ first\n• Try basic troubleshooting\n• Have your account details ready\n• Note your report reference ID\n\nHow else can I help you today? 🤝"
      },

      // Technical Help
      technical: {
        keywords: ['not working', 'error', 'bug', 'problem', 'issue', 'broken', 'fix'],
        response: "🔧 **Technical Troubleshooting:**\n\n**🔄 Quick Fixes:**\n1. **Refresh the page** (Ctrl+F5 or Cmd+R)\n2. **Clear browser cache:**\n   • Chrome: Ctrl+Shift+Delete\n   • Firefox: Ctrl+Shift+Delete\n   • Safari: Cmd+Option+E\n3. **Try incognito/private mode**\n4. **Check internet connection**\n\n**🌐 Browser Issues:**\n• **Recommended:** Chrome, Firefox, Safari (latest versions)\n• **Enable JavaScript**\n• **Allow location access** (for GPS features)\n• **Enable cookies**\n\n**📱 Mobile Issues:**\n• Use mobile browser or app\n• Check mobile data/WiFi\n• Update browser app\n• Clear app cache\n\n**🚫 Common Problems:**\n• **Can't upload photos:** Check file size (<10MB)\n• **Location not working:** Enable GPS/location services\n• **Login issues:** Check email/password, clear cache\n• **Slow loading:** Check internet speed\n\n**📋 Still Having Issues?**\n• Screenshot the error\n• Note what you were doing\n• Try different browser/device\n• Contact support with details\n\nWhat specific problem are you facing? 🤔"
      },

      // Emergency & Urgent Issues
      emergency: {
        keywords: ['emergency', 'urgent', 'immediate', 'danger', 'safety'],
        response: "🚨 **Emergency Response:**\n\n**⚠️ IMMEDIATE DANGERS:**\nFor life-threatening emergencies, call:\n• **Police:** 100\n• **Fire:** 101\n• **Ambulance:** 108\n• **Disaster Management:** 1078\n\n**🏛️ Civic Emergencies:**\n• **Gas leaks:** Call gas company + 100\n• **Water main breaks:** Municipal emergency line\n• **Electrical hazards:** Electricity board emergency\n• **Road accidents:** 100 + 108\n\n**📝 After Emergency Response:**\n1. Ensure safety first\n2. Report to authorities\n3. Then use our platform to:\n   • Document the issue\n   • Track repair progress\n   • Prevent future incidents\n\n**🚫 Platform Limitations:**\n• Not for immediate emergencies\n• Use for follow-up and tracking\n• Best for non-urgent civic issues\n• Response time: 1-5 business days\n\n**💡 When to Use Civicare:**\n• After emergency is handled\n• For preventive measures\n• To track repair progress\n• For community awareness\n\nIs this a current emergency? If yes, please call appropriate emergency services first! 🚨"
      }
    };
  }

  // Find the best response for user input
  findResponse(userMessage) {
    const message = userMessage.toLowerCase().trim();
    
    // Check each category for keyword matches
    for (const [category, data] of Object.entries(this.faqDatabase)) {
      if (data.keywords) {
        for (const keyword of data.keywords) {
          if (message.includes(keyword.toLowerCase())) {
            return data.responses ? 
              data.responses[Math.floor(Math.random() * data.responses.length)] : 
              data.response;
          }
        }
      }
    }

    // Fallback response
    return this.getDefaultResponse();
  }

  getDefaultResponse() {
    return "🤔 I'm not sure about that specific question. Here's what I can help you with:\n\n📝 **Issue Reporting** - How to submit and track reports\n👤 **Account Help** - Login, signup, profile management\n🌟 **Platform Features** - Available tools and capabilities\n📞 **Contact Info** - Support team and emergency numbers\n🔧 **Technical Help** - Troubleshooting common issues\n\nTry asking about one of these topics, or contact our support team at support@civicare.gov for personalized assistance! 📧\n\nYou can also try rephrasing your question - I might understand it better! 💡";
  }

  // Get quick reply suggestions
  getQuickReplies() {
    return [
      "How to report an issue?",
      "Track my reports",
      "Account help",
      "Platform features",
      "Contact support",
      "Emergency numbers"
    ];
  }

  // Get conversation starters
  getConversationStarters() {
    return [
      "👋 Welcome! How can I help you today?",
      "🏛️ Hi! I'm CiviBot, your civic assistant. What would you like to know?",
      "📝 Hello! Ready to report an issue or need help with the platform?"
    ];
  }
}

export const chatbotService = new ChatbotService();
export default chatbotService;
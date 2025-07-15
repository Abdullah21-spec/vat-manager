# Client VAT Manager

A modern, responsive web application for managing client company information and VAT return due dates with automated WhatsApp and email alerts. Built with vanilla HTML, CSS, and JavaScript for easy deployment and maintenance.

## Features

### 📊 Dashboard Overview
- **Total Clients**: View the total number of clients in your system
- **Urgent Returns**: See how many VAT returns are due within 7 days
- **Upcoming Returns**: Track returns due within 30 days
- **Pending Alerts**: Monitor clients that need VAT return reminders

### 👥 Client Management
- **Add New Clients**: Complete form with company details, contact information, and VAT details
- **Edit Clients**: Update any client information at any time
- **Delete Clients**: Remove clients with confirmation dialog
- **Search & Filter**: Find clients quickly with search and status filters

### 📅 VAT Return Tracking
- **Due Date Tracking**: Automatic calculation of days until due date
- **Status Indicators**: 
  - 🟢 Normal: More than 30 days until due
  - 🟡 Upcoming: 8-30 days until due
  - 🔴 Urgent: 1-7 days until due
  - ⚠️ Overdue: Past due date
- **VAT Periods**: Support for monthly, quarterly, and annual VAT periods

### 🔔 Alert System
- **WhatsApp Alerts**: Send direct WhatsApp messages to clients
- **Email Alerts**: Send professional email reminders
- **Customizable Timing**: Set alerts 7, 14, 21, or 30 days before due date
- **Alert Types**: Choose Email only, WhatsApp only, or both
- **Alert History**: Track which alerts have been sent
- **Smart Notifications**: Automatic detection of clients needing alerts

### 💾 Data Persistence
- **Local Storage**: All data is saved locally in your browser
- **No Server Required**: Works completely offline
- **Data Export**: Easy to backup and restore data

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Installation
1. Download or clone this repository
2. Open `index.html` in your web browser
3. Start managing your clients!

### Usage

#### Adding a New Client
1. Click the "Add New Client" button
2. Fill in the required fields:
   - **Company Name** (required)
   - **Next Due Date** (required)
3. Configure alert settings:
   - **Alert Email**: Email address for VAT reminders
   - **WhatsApp Number**: Phone number for WhatsApp alerts
   - **Alert Days**: How many days before due date to send alerts
   - **Alert Type**: Email, WhatsApp, or both
   - **Enable Alerts**: Toggle automatic alerts on/off
4. Optionally fill in additional details:
   - VAT Number
   - Contact Person
   - Email and Phone
   - Address
   - VAT Period (monthly/quarterly/annually)
   - Notes
5. Click "Save Client"

#### Managing Existing Clients
- **Edit**: Click the edit icon (pencil) on any client card
- **Delete**: Click the delete icon (trash) and confirm
- **Send Alert**: Click the bell icon to send VAT reminders
- **Search**: Use the search box to find specific clients
- **Filter**: Use the filter buttons to view clients by status

#### Sending Alerts
1. **Automatic Detection**: Clients needing alerts show a bell icon
2. **Preview Messages**: Click the bell to see email and WhatsApp previews
3. **Send Email**: Opens your default email client with pre-filled message
4. **Send WhatsApp**: Opens WhatsApp Web/App with pre-filled message
5. **Track Status**: See which alerts have been sent recently

#### Understanding the Dashboard
- **Stats Cards**: Overview of your client base and urgent returns
- **Client Cards**: Each card shows:
  - Company name and VAT number
  - Contact information
  - VAT period and alert settings
  - Due date with status indicator
  - Days remaining or overdue
  - Alert status (if alerts have been sent)

## Alert System Details

### Alert Configuration
- **Alert Email**: Professional email address for VAT reminders
- **WhatsApp Number**: International format (e.g., +44 20 1234 5678)
- **Alert Timing**: 7, 14, 21, or 30 days before due date
- **Alert Types**:
  - **Both**: Send both email and WhatsApp
  - **Email Only**: Send only email reminders
  - **WhatsApp Only**: Send only WhatsApp messages

### Message Templates
**Email Template:**
```
Dear [Contact Person],

This is a reminder that your VAT return for [Company Name] is due on [Due Date] ([X] days from now).

Please ensure all necessary documentation is prepared and submitted on time to avoid any late filing penalties.

If you have any questions or need assistance with your VAT return, please don't hesitate to contact us.

Best regards,
Your VAT Management Team
```

**WhatsApp Template:**
```
🔔 VAT Return Reminder

Hi [Contact Person]!

Your VAT return for [Company Name] is due on [Due Date] ([X] days).

Please ensure timely submission to avoid penalties.

Need help? Contact us! 📞
```

### Alert Features
- **Smart Detection**: Automatically identifies clients needing alerts
- **Message Preview**: Review messages before sending
- **Direct Integration**: Opens email client and WhatsApp directly
- **Alert History**: Tracks sent alerts for 7 days
- **Status Indicators**: Visual feedback on alert status

## File Structure

```
client-vat-manager/
├── index.html          # Main application file
├── styles.css          # Modern, responsive styling
├── script.js           # Application logic and functionality
└── README.md           # This file
```

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup and modern structure
- **CSS3**: Flexbox, Grid, animations, and responsive design
- **JavaScript (ES6+)**: Modern JavaScript with classes and modules
- **Font Awesome**: Icons for better user experience
- **Local Storage**: Client-side data persistence

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Data Structure
Each client object contains:
```javascript
{
  id: "unique_id",
  companyName: "Company Name",
  vatNumber: "GB123456789",
  contactPerson: "Contact Name",
  email: "email@company.com",
  phone: "+44 20 1234 5678",
  address: "Company Address",
  vatPeriod: "quarterly", // monthly, quarterly, annually
  nextDueDate: "2024-02-15",
  notes: "Additional notes",
  // Alert settings
  alertEmail: "alert@company.com",
  alertWhatsApp: "+44 20 1234 5678",
  alertDays: "7", // 7, 14, 21, 30
  alertType: "both", // email, whatsapp, both
  enableAlerts: true,
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

## Customization

### Styling
- Modify `styles.css` to change colors, fonts, and layout
- The app uses CSS custom properties for easy theming
- Responsive design works on all screen sizes

### Functionality
- Edit `script.js` to add new features
- The modular class structure makes it easy to extend
- All data is stored in browser's localStorage

### Alert Customization
- Modify message templates in `generateEmailMessage()` and `generateWhatsAppMessage()`
- Adjust alert timing logic in `shouldSendAlert()`
- Customize alert status tracking in `getAlertStatus()`

### Sample Data
The application comes with sample data to demonstrate functionality. You can:
- Delete sample clients
- Modify the sample data in `script.js`
- Start fresh by clearing localStorage

## Security & Privacy

- **Local Storage**: All data stays on your device
- **No External Dependencies**: No data sent to external servers
- **Offline Capable**: Works without internet connection
- **No Tracking**: No analytics or tracking code
- **Direct Integration**: Alerts use your existing email and WhatsApp applications for sending messages.

## Alert Integration

### Email Integration
- Uses `mailto:` links to open your default email client
- Pre-fills subject and message body
- Works with Outlook, Gmail, Apple Mail, etc.

### WhatsApp Integration
- Uses WhatsApp Web API (`wa.me` links)
- Opens WhatsApp Web or mobile app
- Pre-fills message content
- Supports international phone numbers

## Support

### Common Issues
1. **Data not saving**: Check if localStorage is enabled in your browser
2. **Styling issues**: Ensure CSS file is in the same directory as HTML
3. **JavaScript errors**: Check browser console for error messages
4. **Alerts not working**: Ensure email client and WhatsApp are properly configured

### Browser Settings
- Enable JavaScript
- Allow localStorage (usually enabled by default)
- Use a modern browser for best experience
- Configure default email client for email alerts

## Future Enhancements

Potential features for future versions:
- Export data to CSV/Excel
- Automatic alert scheduling
- Multiple user accounts
- Cloud synchronization
- Advanced reporting and analytics
- Integration with accounting software
- SMS alerts via third-party services
- Calendar integration
- Bulk alert sending

## License

This project is open source and available under the MIT License.

---

**Note**: This application is designed for local use and stores all data in your browser's localStorage. For production use with multiple users, consider implementing a backend server and database. The alert system uses your existing email and WhatsApp applications for sending messages. 

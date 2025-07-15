// Client VAT Manager Application
class ClientVATManager {
    constructor() {
        this.clients = JSON.parse(localStorage.getItem('clients')) || [];
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.editingClientId = null;
        this.alertHistory = JSON.parse(localStorage.getItem('alertHistory')) || {};
        
        this.initializeEventListeners();
        this.renderClients();
        this.updateStats();
        this.checkForAlerts();
    }

    initializeEventListeners() {
        // Add client button
        document.getElementById('addClientBtn').addEventListener('click', () => {
            this.openModal();
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.renderClients();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderClients();
            });
        });

        // Modal close buttons
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                this.closeModal();
                this.closeAlertPreviewModal();
            });
        });

        // Cancel buttons
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
            this.closeDeleteModal();
        });

        document.getElementById('cancelAlertBtn').addEventListener('click', () => {
            this.closeAlertPreviewModal();
        });

        // Form submission
        document.getElementById('clientForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveClient();
        });

        // Delete confirmation
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            this.deleteClient();
        });

        // Alert buttons
        document.getElementById('sendEmailBtn').addEventListener('click', () => {
            this.sendEmailAlert();
        });

        document.getElementById('sendWhatsAppBtn').addEventListener('click', () => {
            this.sendWhatsAppAlert();
        });

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
                this.closeDeleteModal();
                this.closeAlertPreviewModal();
            }
        });
    }

    openModal(client = null) {
        const modal = document.getElementById('clientModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('clientForm');

        if (client) {
            // Edit mode
            this.editingClientId = client.id;
            modalTitle.textContent = 'Edit Client';
            this.populateForm(client);
        } else {
            // Add mode
            this.editingClientId = null;
            modalTitle.textContent = 'Add New Client';
            form.reset();
            // Set default alert settings
            document.getElementById('alertDays').value = '7';
            document.getElementById('alertType').value = 'both';
            document.getElementById('enableAlerts').checked = true;
        }

        modal.style.display = 'block';
    }

    closeModal() {
        const modal = document.getElementById('clientModal');
        modal.style.display = 'none';
        this.editingClientId = null;
    }

    openDeleteModal(clientId) {
        const modal = document.getElementById('deleteModal');
        modal.style.display = 'block';
        modal.dataset.clientId = clientId;
    }

    closeDeleteModal() {
        const modal = document.getElementById('deleteModal');
        modal.style.display = 'none';
    }

    openAlertPreviewModal(clientId) {
        const client = this.clients.find(c => c.id === clientId);
        if (!client) return;

        const modal = document.getElementById('alertPreviewModal');
        const previewClientName = document.getElementById('previewClientName');
        const emailPreview = document.getElementById('emailPreview');
        const whatsappPreview = document.getElementById('whatsappPreview');

        previewClientName.textContent = client.companyName;
        
        const emailMessage = this.generateEmailMessage(client);
        const whatsappMessage = this.generateWhatsAppMessage(client);
        
        emailPreview.textContent = emailMessage;
        whatsappPreview.textContent = whatsappMessage;
        
        modal.dataset.clientId = clientId;
        modal.style.display = 'block';
    }

    closeAlertPreviewModal() {
        const modal = document.getElementById('alertPreviewModal');
        modal.style.display = 'none';
    }

    populateForm(client) {
        document.getElementById('companyName').value = client.companyName;
        document.getElementById('vatNumber').value = client.vatNumber || '';
        document.getElementById('contactPerson').value = client.contactPerson || '';
        document.getElementById('email').value = client.email || '';
        document.getElementById('phone').value = client.phone || '';
        document.getElementById('address').value = client.address || '';
        document.getElementById('vatPeriod').value = client.vatPeriod || 'quarterly';
        document.getElementById('nextDueDate').value = client.nextDueDate;
        document.getElementById('notes').value = client.notes || '';
        
        // Alert settings
        document.getElementById('alertEmail').value = client.alertEmail || '';
        document.getElementById('alertWhatsApp').value = client.alertWhatsApp || '';
        document.getElementById('alertDays').value = client.alertDays || '7';
        document.getElementById('alertType').value = client.alertType || 'both';
        document.getElementById('enableAlerts').checked = client.enableAlerts !== false;
    }

    saveClient() {
        const formData = {
            companyName: document.getElementById('companyName').value.trim(),
            vatNumber: document.getElementById('vatNumber').value.trim(),
            contactPerson: document.getElementById('contactPerson').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            address: document.getElementById('address').value.trim(),
            vatPeriod: document.getElementById('vatPeriod').value,
            nextDueDate: document.getElementById('nextDueDate').value,
            notes: document.getElementById('notes').value.trim(),
            // Alert settings
            alertEmail: document.getElementById('alertEmail').value.trim(),
            alertWhatsApp: document.getElementById('alertWhatsApp').value.trim(),
            alertDays: document.getElementById('alertDays').value,
            alertType: document.getElementById('alertType').value,
            enableAlerts: document.getElementById('enableAlerts').checked
        };

        if (!formData.companyName || !formData.nextDueDate) {
            alert('Please fill in all required fields (Company Name and Next Due Date)');
            return;
        }

        if (this.editingClientId) {
            // Update existing client
            const index = this.clients.findIndex(c => c.id === this.editingClientId);
            if (index !== -1) {
                this.clients[index] = { ...this.clients[index], ...formData };
            }
        } else {
            // Add new client
            const newClient = {
                id: Date.now().toString(),
                ...formData,
                createdAt: new Date().toISOString()
            };
            this.clients.push(newClient);
        }

        this.saveToLocalStorage();
        this.renderClients();
        this.updateStats();
        this.closeModal();
    }

    deleteClient() {
        const modal = document.getElementById('deleteModal');
        const clientId = modal.dataset.clientId;
        
        this.clients = this.clients.filter(c => c.id !== clientId);
        delete this.alertHistory[clientId];
        this.saveToLocalStorage();
        this.renderClients();
        this.updateStats();
        this.closeDeleteModal();
    }

    saveToLocalStorage() {
        localStorage.setItem('clients', JSON.stringify(this.clients));
        localStorage.setItem('alertHistory', JSON.stringify(this.alertHistory));
    }

    getFilteredClients() {
        let filtered = this.clients;

        // Apply search filter
        if (this.searchTerm) {
            filtered = filtered.filter(client => 
                client.companyName.toLowerCase().includes(this.searchTerm) ||
                client.vatNumber.toLowerCase().includes(this.searchTerm) ||
                client.contactPerson.toLowerCase().includes(this.searchTerm) ||
                client.email.toLowerCase().includes(this.searchTerm)
            );
        }

        // Apply status filter
        if (this.currentFilter !== 'all') {
            const today = new Date();
            const sevenDaysFromNow = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
            const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));

            filtered = filtered.filter(client => {
                const dueDate = new Date(client.nextDueDate);
                
                if (this.currentFilter === 'urgent') {
                    return dueDate <= sevenDaysFromNow && dueDate >= today;
                } else if (this.currentFilter === 'upcoming') {
                    return dueDate <= thirtyDaysFromNow && dueDate > sevenDaysFromNow;
                } else if (this.currentFilter === 'alerts') {
                    return this.shouldSendAlert(client);
                }
                return true;
            });
        }

        return filtered;
    }

    shouldSendAlert(client) {
        if (!client.enableAlerts) return false;
        
        const today = new Date();
        const dueDate = new Date(client.nextDueDate);
        const alertDays = parseInt(client.alertDays) || 7;
        const alertDate = new Date(dueDate.getTime() - (alertDays * 24 * 60 * 60 * 1000));
        
        return today >= alertDate && dueDate > today;
    }

    getClientStatus(dueDate) {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return { status: 'overdue', days: Math.abs(diffDays) };
        } else if (diffDays <= 7) {
            return { status: 'urgent', days: diffDays };
        } else if (diffDays <= 30) {
            return { status: 'upcoming', days: diffDays };
        } else {
            return { status: 'normal', days: diffDays };
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    generateEmailMessage(client) {
        const dueDate = this.formatDate(client.nextDueDate);
        const daysUntilDue = this.getClientStatus(client.nextDueDate).days;
        
        return `Dear ${client.contactPerson || 'Valued Client'},

This is a reminder that your VAT return for ${client.companyName} is due on ${dueDate} (${daysUntilDue} days from now).

Please ensure all necessary documentation is prepared and submitted on time to avoid any late filing penalties.

If you have any questions or need assistance with your VAT return, please don't hesitate to contact us.

Best regards,
Your VAT Management Team`;
    }

    generateWhatsAppMessage(client) {
        const dueDate = this.formatDate(client.nextDueDate);
        const daysUntilDue = this.getClientStatus(client.nextDueDate).days;
        
        return `🔔 VAT Return Reminder

Hi ${client.contactPerson || 'there'}!

Your VAT return for ${client.companyName} is due on ${dueDate} (${daysUntilDue} days).

Please ensure timely submission to avoid penalties.

Need help? Contact us! 📞`;
    }

    sendEmailAlert() {
        const modal = document.getElementById('alertPreviewModal');
        const clientId = modal.dataset.clientId;
        const client = this.clients.find(c => c.id === clientId);
        
        if (!client || !client.alertEmail) {
            alert('No email address configured for this client');
            return;
        }

        const subject = `VAT Return Reminder - ${client.companyName}`;
        const body = this.generateEmailMessage(client);
        const mailtoLink = `mailto:${client.alertEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        window.open(mailtoLink);
        
        // Record the alert
        this.recordAlert(clientId, 'email');
        this.closeAlertPreviewModal();
        this.renderClients();
    }

    sendWhatsAppAlert() {
        const modal = document.getElementById('alertPreviewModal');
        const clientId = modal.dataset.clientId;
        const client = this.clients.find(c => c.id === clientId);
        
        if (!client || !client.alertWhatsApp) {
            alert('No WhatsApp number configured for this client');
            return;
        }

        const message = this.generateWhatsAppMessage(client);
        const whatsappNumber = client.alertWhatsApp.replace(/[^0-9]/g, '');
        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappLink, '_blank');
        
        // Record the alert
        this.recordAlert(clientId, 'whatsapp');
        this.closeAlertPreviewModal();
        this.renderClients();
    }

    recordAlert(clientId, type) {
        if (!this.alertHistory[clientId]) {
            this.alertHistory[clientId] = [];
        }
        
        this.alertHistory[clientId].push({
            type: type,
            sentAt: new Date().toISOString(),
            clientId: clientId
        });
        
        this.saveToLocalStorage();
    }

    getAlertStatus(clientId) {
        if (!this.alertHistory[clientId]) return 'pending';
        
        const recentAlerts = this.alertHistory[clientId].filter(alert => {
            const alertDate = new Date(alert.sentAt);
            const today = new Date();
            const diffDays = (today - alertDate) / (1000 * 60 * 60 * 24);
            return diffDays <= 7; // Show recent alerts (last 7 days)
        });
        
        if (recentAlerts.length === 0) return 'pending';
        if (recentAlerts.some(alert => alert.type === 'email')) return 'email-sent';
        if (recentAlerts.some(alert => alert.type === 'whatsapp')) return 'whatsapp-sent';
        return 'pending';
    }

    renderClients() {
        const clientsGrid = document.getElementById('clientsGrid');
        const filteredClients = this.getFilteredClients();

        if (filteredClients.length === 0) {
            clientsGrid.innerHTML = `
                <div class="no-clients">
                    <i class="fas fa-inbox" style="font-size: 3rem; color: #6c757d; margin-bottom: 20px;"></i>
                    <h3>No clients found</h3>
                    <p>${this.searchTerm ? 'Try adjusting your search terms.' : 'Add your first client to get started!'}</p>
                </div>
            `;
            return;
        }

        clientsGrid.innerHTML = filteredClients.map(client => {
            const status = this.getClientStatus(client.nextDueDate);
            const statusClass = status.status === 'overdue' ? 'urgent' : status.status;
            const alertStatus = this.getAlertStatus(client.id);
            const needsAlert = this.shouldSendAlert(client);
            
            return `
                <div class="client-card ${statusClass} ${needsAlert ? 'alert-needed' : ''}" data-id="${client.id}">
                    <div class="client-header">
                        <div>
                            <div class="client-name">${client.companyName}</div>
                            ${client.vatNumber ? `<div class="client-vat">VAT: ${client.vatNumber}</div>` : ''}
                        </div>
                        <div class="client-actions">
                            ${needsAlert ? `
                                <button class="action-btn alert-btn" onclick="app.openAlertPreviewModal('${client.id}')" title="Send Alert">
                                    <i class="fas fa-bell"></i>
                                </button>
                            ` : ''}
                            <button class="action-btn edit-btn" onclick="app.editClient('${client.id}')" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete-btn" onclick="app.openDeleteModal('${client.id}')" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="client-info">
                        ${client.contactPerson ? `
                            <div class="info-row">
                                <i class="fas fa-user"></i>
                                <span>${client.contactPerson}</span>
                            </div>
                        ` : ''}
                        ${client.email ? `
                            <div class="info-row">
                                <i class="fas fa-envelope"></i>
                                <span>${client.email}</span>
                            </div>
                        ` : ''}
                        ${client.phone ? `
                            <div class="info-row">
                                <i class="fas fa-phone"></i>
                                <span>${client.phone}</span>
                            </div>
                        ` : ''}
                        ${client.address ? `
                            <div class="info-row">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${client.address}</span>
                            </div>
                        ` : ''}
                        <div class="info-row">
                            <i class="fas fa-calendar"></i>
                            <span>${client.vatPeriod.charAt(0).toUpperCase() + client.vatPeriod.slice(1)} VAT Period</span>
                        </div>
                        ${client.enableAlerts ? `
                            <div class="info-row">
                                <i class="fas fa-bell"></i>
                                <span>Alerts: ${client.alertType} (${client.alertDays} days before)</span>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="client-due-date ${status.status === 'overdue' ? 'urgent' : ''}">
                        <div class="due-date-label">
                            ${status.status === 'overdue' ? 'OVERDUE' : 'Next Due Date'}
                        </div>
                        <div class="due-date-value">
                            ${this.formatDate(client.nextDueDate)}
                            ${status.status === 'overdue' ? ` (${status.days} days overdue)` : 
                              status.status === 'urgent' ? ` (${status.days} days)` : 
                              status.status === 'upcoming' ? ` (${status.days} days)` : ''}
                        </div>
                    </div>
                    
                    ${alertStatus !== 'pending' ? `
                        <div class="alert-status ${alertStatus}">
                            <i class="fas fa-${alertStatus === 'email-sent' ? 'envelope' : 'whatsapp'}"></i>
                            <span>${alertStatus === 'email-sent' ? 'Email sent' : 'WhatsApp sent'}</span>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    editClient(clientId) {
        const client = this.clients.find(c => c.id === clientId);
        if (client) {
            this.openModal(client);
        }
    }

    openDeleteModal(clientId) {
        this.openDeleteModal(clientId);
    }

    openAlertPreviewModal(clientId) {
        this.openAlertPreviewModal(clientId);
    }

    checkForAlerts() {
        const clientsNeedingAlerts = this.clients.filter(client => this.shouldSendAlert(client));
        // You could implement automatic alert sending here
        // For now, we just update the stats
        this.updateStats();
    }

    updateStats() {
        const today = new Date();
        const sevenDaysFromNow = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
        const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));

        const urgentReturns = this.clients.filter(client => {
            const dueDate = new Date(client.nextDueDate);
            return dueDate <= sevenDaysFromNow && dueDate >= today;
        }).length;

        const upcomingReturns = this.clients.filter(client => {
            const dueDate = new Date(client.nextDueDate);
            return dueDate <= thirtyDaysFromNow && dueDate > sevenDaysFromNow;
        }).length;

        const pendingAlerts = this.clients.filter(client => this.shouldSendAlert(client)).length;

        document.getElementById('totalClients').textContent = this.clients.length;
        document.getElementById('urgentReturns').textContent = urgentReturns;
        document.getElementById('upcomingReturns').textContent = upcomingReturns;
        document.getElementById('pendingAlerts').textContent = pendingAlerts;
    }
}

// Initialize the application
const app = new ClientVATManager();

// Add some sample data for demonstration
if (app.clients.length === 0) {
    const sampleClients = [
        {
            id: '1',
            companyName: 'Tech Solutions Ltd',
            vatNumber: 'GB123456789',
            contactPerson: 'John Smith',
            email: 'john@techsolutions.com',
            phone: '+44 20 1234 5678',
            address: '123 Business Street, London, UK',
            vatPeriod: 'quarterly',
            nextDueDate: '2024-02-15',
            notes: 'Software development company',
            alertEmail: 'john@techsolutions.com',
            alertWhatsApp: '+44 20 1234 5678',
            alertDays: '7',
            alertType: 'both',
            enableAlerts: true,
            createdAt: new Date().toISOString()
        },
        {
            id: '2',
            companyName: 'Green Energy Co',
            vatNumber: 'GB987654321',
            contactPerson: 'Sarah Johnson',
            email: 'sarah@greenenergy.co.uk',
            phone: '+44 20 9876 5432',
            address: '456 Renewable Road, Manchester, UK',
            vatPeriod: 'monthly',
            nextDueDate: '2024-01-31',
            notes: 'Renewable energy provider',
            alertEmail: 'sarah@greenenergy.co.uk',
            alertWhatsApp: '+44 20 9876 5432',
            alertDays: '14',
            alertType: 'email',
            enableAlerts: true,
            createdAt: new Date().toISOString()
        },
        {
            id: '3',
            companyName: 'Global Trading Ltd',
            vatNumber: 'GB555666777',
            contactPerson: 'Michael Brown',
            email: 'michael@globaltrading.com',
            phone: '+44 20 5555 6666',
            address: '789 Trade Avenue, Birmingham, UK',
            vatPeriod: 'quarterly',
            nextDueDate: '2024-03-31',
            notes: 'Import/export business',
            alertEmail: 'michael@globaltrading.com',
            alertWhatsApp: '+44 20 5555 6666',
            alertDays: '21',
            alertType: 'whatsapp',
            enableAlerts: true,
            createdAt: new Date().toISOString()
        }
    ];

    app.clients = sampleClients;
    app.saveToLocalStorage();
    app.renderClients();
    app.updateStats();
} 
// QR Code Generator Application
class QRCodeGenerator {
    constructor() {
        this.qrInput = document.getElementById('qr-input');
        this.qrSize = document.getElementById('qr-size');
        this.qrContainer = document.getElementById('qr-container');
        this.actionButtons = document.getElementById('action-buttons');
        this.downloadBtn = document.getElementById('download-btn');
        this.copyBtn = document.getElementById('copy-btn');
        this.clearBtn = document.getElementById('clear-btn');
        this.loading = document.getElementById('loading');
        this.errorMessage = document.getElementById('error-message');
        this.logoInput = document.getElementById('logo-input');
        this.removeLogoBtn = document.getElementById('remove-logo-btn');
        this.qrTypeButtons = document.querySelectorAll('.qr-type-btn');
        this.inputContainer = document.getElementById('input-container');
        this.generateBtn = document.getElementById('generate-btn');

        // Image fields
        this.imageDropZone = document.getElementById('image-drop-zone');
        this.imageFile = document.getElementById('image-file');
        this.imagePreviewContainer = document.getElementById('image-preview-container');
        this.imagePreview = document.getElementById('image-preview');
        this.removeImageBtn = document.getElementById('remove-image-btn');
        // Remove patternSelect and pattern-related fields
        // Body patterns elements
        this.patternItems = document.querySelectorAll('.pattern-item');
        this.primaryColorPicker = document.getElementById('primary-color');
        this.secondaryColorPicker = document.getElementById('secondary-color');
        this.colorTypeRadios = document.querySelectorAll('input[name="color-type"]');
        this.colorPickerBtn = document.getElementById('color-picker-btn');

        // WiFi fields
        this.wifiSsid = document.getElementById('wifi-ssid');
        this.wifiPassword = document.getElementById('wifi-password');
        this.wifiEncryption = document.getElementById('wifi-encryption');

        // Image/Video fields
        this.videoUrl = document.getElementById('video-url');
        
        this.currentQRCode = null;
        this.logoImage = null;
        this.imageData = null;
        this.activeQrType = 'text';
        this.selectedPattern = 'default';
        this.colorType = 'single';
        this.primaryColor = '#000000';
        this.secondaryColor = '#ffffff';
        this.deferredPrompt = null; // For PWA installation
        
        this.init();
    }
    
    init() {
        // Event listeners
        this.generateBtn.addEventListener('click', () => this.generateQRCode());
        this.qrSize.addEventListener('change', () => this.generateQRCode());
        this.downloadBtn.addEventListener('click', () => this.downloadQRCode());
        this.copyBtn.addEventListener('click', () => this.copyQRCode());
        this.clearBtn.addEventListener('click', () => this.clearInput());
        this.logoInput.addEventListener('change', (e) => this.handleLogoUpload(e));
        this.removeLogoBtn.addEventListener('click', () => this.removeLogo());

        this.qrTypeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.switchQrType(btn.dataset.type));
        });

        // Image drag and drop
        this.imageDropZone.addEventListener('click', () => this.imageFile.click());
        this.imageDropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.imageDropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.imageDropZone.addEventListener('drop', (e) => this.handleDrop(e));
        this.imageFile.addEventListener('change', (e) => this.handleImageFile(e.target.files[0]));
        this.removeImageBtn.addEventListener('click', () => this.removeImage());
        // Remove patternSelect event listener in init()
        
        // PWA installation handling
        this.initPWA();
        
        // Focus on input
        this.qrInput.focus();
    }

    handleLogoUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 102400) {
            this.showError('Logo image size must be 100KB or less.');
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                this.logoImage = img;
                this.removeLogoBtn.style.display = 'inline-block';
                this.generateQRCode();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    removeLogo() {
        this.logoImage = null;
        this.logoInput.value = '';
        this.removeLogoBtn.style.display = 'none';
        this.generateQRCode();
    }

    drawLogoOnCanvas(canvas, logo) {
        const ctx = canvas.getContext('2d');
        const logoSize = canvas.width * 0.25; // Logo will be 25% of the QR code size
        const logoX = (canvas.width - logoSize) / 2;
        const logoY = (canvas.height - logoSize) / 2;

        // Draw a white background for the logo
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);

        ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
    }

    handleDragOver(e) {
        e.preventDefault();
        this.imageDropZone.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.imageDropZone.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        this.imageDropZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        this.handleImageFile(file);
    }

    handleImageFile(file) {
        if (!file) return;
        if (file.size > 102400) {
            this.showError('Image size must be 100KB or less.');
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            this.imageData = event.target.result;
            this.imagePreview.src = event.target.result;
            this.imagePreviewContainer.style.display = 'block';
            this.generateQRCode();
        };
        reader.readAsDataURL(file);
    }

    removeImage() {
        this.imageData = null;
        this.imageFile.value = '';
        this.imagePreviewContainer.style.display = 'none';
        this.imageDropZone.style.display = 'block';
    }

    // Remove getPatternColors and switchQrType
    // getPatternColors(pattern) {
    //     const patterns = {
    //         'default': { dark: '#000000', light: '#FFFFFF' },
    //         'cyber': { dark: '#00ffff', light: '#0a0a0a' },
    //         'ocean': { dark: '#004d7a', light: '#e0f7fa' },
    //         'sunset': { dark: '#c33764', light: '#f8f3d4' },
    //         'forest': { dark: '#134e4a', light: '#f0fdf4' },
    //         'nebula': { dark: '#4c1d95', light: '#f5f3ff' },
    //         'gold': { dark: '#785a28', light: '#fffbeb' },
    //         'ruby': { dark: '#9f1239', light: '#fff1f2' },
    //         'emerald': { dark: '#065f46', light: '#ecfdf5' },
    //         'sapphire': { dark: '#1e40af', light: '#eff6ff' },
    //         'mono-light': { dark: '#525252', light: '#f5f5f5' },
    //         // Premium Patterns
    //         'amethyst': { dark: '#9966cc', light: '#f3e5f5' },
    //         'citrine': { dark: '#f4a261', light: '#fff8e1' },
    //         'rose-gold': { dark: '#b76e79', light: '#fce4ec' },
    //         'midnight': { dark: '#003366', light: '#e1e8f0' },
    //         'toxic': { dark: '#7fff00', light: '#1a1a1a' },
    //         'lava': { dark: '#d73721', light: '#ffeadb' },
    //         'ice': { dark: '#87ceeb', light: '#f0ffff' },
    //         'royal': { dark: '#4b0082', light: '#fffacd' },
    //         'holographic': { dark: '#ff00ff', light: '#e0ffff' },
    //         'monochrome-dark': { dark: '#e0e0e0', light: '#212121' }
    //     };
    //     return patterns[pattern] || patterns.default;
    // }
    
    switchQrType(type) {
        this.activeQrType = type;
        this.qrTypeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });
        this.inputContainer.querySelectorAll('.input-group').forEach(group => {
            group.style.display = group.dataset.type === type ? 'block' : 'none';
        });
        this.generateQRCode();
    }
    
    async generateQRCode() {
        let text = '';
        switch (this.activeQrType) {
            case 'text':
                text = this.qrInput.value.trim();
                break;
            case 'wifi':
                const ssid = this.wifiSsid.value.trim();
                const password = this.wifiPassword.value.trim();
                const encryption = this.wifiEncryption.value;
                if (ssid) {
                    text = `WIFI:T:${encryption};S:${ssid};P:${password};;`;
                }
                break;
            case 'video':
                text = this.videoUrl.value.trim();
                break;
            case 'youtube':
                const youtubeUrlInput = document.getElementById('youtube-url');
                if (youtubeUrlInput) {
                    text = youtubeUrlInput.value.trim();
                }
                break;
        }
        
        if (!text) {
            this.showPlaceholder();
            return;
        }
        
        this.showLoading();
        
        try {
            const size = parseInt(this.qrSize.value);
            
            // Clear previous QR code
            this.clearQRDisplay();
            
            // Check if QRCode library is available, use fallback if not
            if (typeof QRCode === 'undefined' || window.QRLibraryReady === 'fallback') {
                console.error('QRCode library not loaded, using fallback');
                this.generateQRCodeFallback(text, size);
                return;
            }
            
            // Generate QR code
            const canvas = document.createElement('canvas');
            
            // Use default colors (black on white)
            const colors = { dark: '#000000', light: '#FFFFFF' };

            // Use a Promise wrapper to handle the async generation
            await new Promise((resolve, reject) => {
                QRCode.toCanvas(canvas, text, {
                    width: size,
                    height: size,
                    margin: 2,
                    color: {
                        dark: colors.dark,
                        light: colors.light
                    },
                    errorCorrectionLevel: 'H' // Use 'H' for high error correction when adding a logo
                }, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            });

            if (this.logoImage) {
                this.drawLogoOnCanvas(canvas, this.logoImage);
            }
            
            // Style the canvas
            canvas.id = 'qr-code';
            canvas.style.borderRadius = '10px';
            canvas.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.3)';
            
            this.currentQRCode = canvas;
            
            // Display QR code with animation
            setTimeout(() => {
                this.hideLoading();
                this.showQRCode(canvas);
            }, 500);
            
        } catch (error) {
            console.error('Error generating QR code:', error);
            this.hideLoading();
            this.showError('Unable to generate QR code. Please try again.');
        }
    }
    
    showLoading() {
        this.hideError();
        this.hidePlaceholder();
        this.hideActionButtons();
        this.loading.classList.add('show');
    }
    
    hideLoading() {
        this.loading.classList.remove('show');
    }
    
    showError(message = 'Error generating QR code. Please try again.') {
        this.hideLoading();
        this.hidePlaceholder();
        this.hideActionButtons();
        this.errorMessage.querySelector('p').textContent = message;
        this.errorMessage.classList.add('show');
    }
    
    hideError() {
        this.errorMessage.classList.remove('show');
    }
    
    showPlaceholder() {
        this.hideLoading();
        this.hideError();
        this.hideActionButtons();
        this.clearQRDisplay();
        
        this.qrContainer.innerHTML = `
            <div class="placeholder">
                <img src="icon.svg" alt="AMIK QR CODE" class="placeholder-icon">
                <p>Enter text to generate QR code</p>
            </div>
        `;
        this.qrContainer.classList.remove('has-qr');
    }
    
    hidePlaceholder() {
        const placeholder = this.qrContainer.querySelector('.placeholder');
        if (placeholder) {
            placeholder.remove();
        }
    }
    
    showQRCode(canvas) {
        this.qrContainer.appendChild(canvas);
        this.qrContainer.classList.add('has-qr');
        canvas.classList.add('fade-in', 'scale-in');
        this.showActionButtons();
    }
    
    clearQRDisplay() {
        const existingQR = this.qrContainer.querySelector('#qr-code');
        if (existingQR) {
            existingQR.remove();
        }
        this.qrContainer.classList.remove('has-qr');
    }
    
    showActionButtons() {
        this.actionButtons.style.display = 'flex';
        this.actionButtons.classList.add('fade-in');
    }
    
    hideActionButtons() {
        this.actionButtons.style.display = 'none';
        this.actionButtons.classList.remove('fade-in');
    }
    
    downloadQRCode() {
        if (!this.currentQRCode) return;
        
        try {
            const link = document.createElement('a');
            link.download = `amik-qrcode-${Date.now()}.png`;
            
            // Handle both canvas and image elements
            if (this.currentQRCode.toDataURL) {
                // Canvas element
                link.href = this.currentQRCode.toDataURL('image/png');
            } else {
                // Image element (fallback)
                link.href = this.currentQRCode.src;
            }
            
            link.click();
            this.showNotification('QR Code downloaded successfully!', 'success');
        } catch (error) {
            console.error('Error downloading QR code:', error);
            this.showNotification('Error downloading QR code', 'error');
        }
    }
    
    async copyQRCode() {
        if (!this.currentQRCode) return;
        
        try {
            if (this.currentQRCode.toBlob) {
                // Canvas element
                this.currentQRCode.toBlob(async (blob) => {
                    try {
                        await navigator.clipboard.write([
                            new ClipboardItem({ 'image/png': blob })
                        ]);
                        this.showNotification('QR Code copied to clipboard!', 'success');
                    } catch (error) {
                        console.error('Error copying to clipboard:', error);
                        this.showNotification('Error copying QR code', 'error');
                    }
                }, 'image/png');
            } else {
                // Image element (fallback) - convert to blob first
                const response = await fetch(this.currentQRCode.src);
                const blob = await response.blob();
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]);
                this.showNotification('QR Code copied to clipboard!', 'success');
            }
        } catch (error) {
            console.error('Error copying QR code:', error);
            this.showNotification('Error copying QR code', 'error');
        }
    }
    
    clearInput() {
        this.qrInput.value = '';
        this.showPlaceholder();
        this.qrInput.focus();
        this.showNotification('Cleared!', 'success');
    }
    
    generateQRCodeFallback(text, size) {
        // Fallback method using QR code API service
        try {
            const img = document.createElement('img');
            img.id = 'qr-code';
            img.style.borderRadius = '10px';
            img.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.3)';
            img.style.width = size + 'px';
            img.style.height = size + 'px';
            img.style.background = 'white';
            img.style.padding = '10px';
            
            // Use QR Server API as fallback
            const encodedText = encodeURIComponent(text);
            img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}`;
            
            img.onload = () => {
                this.currentQRCode = img;
                setTimeout(() => {
                    this.hideLoading();
                    this.showQRCode(img);
                }, 500);
            };
            
            img.onerror = () => {
                this.hideLoading();
                this.showError('Unable to generate QR code. Please check your internet connection.');
            };
            
        } catch (error) {
            console.error('Fallback QR generation failed:', error);
            this.hideLoading();
            this.showError('Unable to generate QR code. Please try again.');
        }
    }
    
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
        `;
        
        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;
        
        if (type === 'success') {
            notification.style.background = 'linear-gradient(45deg, #00ffff, #0080ff)';
            notification.style.color = '#000';
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(45deg, #ff4444, #cc0000)';
        } else {
            notification.style.background = 'rgba(255, 255, 255, 0.9)';
            notification.style.color = '#000';
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
    
    // PWA initialization
    initPWA() {
        // Register service worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then((registration) => {
                        console.log('SW registered: ', registration);
                        this.showNotification('App ready for offline use!', 'success');
                    })
                    .catch((registrationError) => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
        
        // Handle PWA installation prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('PWA install prompt triggered');
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });
        
        // Handle successful installation
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            this.hideInstallButton();
            this.showNotification('AMIK QR CODE installed successfully!', 'success');
            this.deferredPrompt = null;
        });
    }
    
    // Show install button
    showInstallButton() {
        // Create install button if it doesn't exist
        if (!document.getElementById('install-btn')) {
            const installBtn = document.createElement('button');
            installBtn.id = 'install-btn';
            installBtn.className = 'btn-primary install-btn';
            installBtn.innerHTML = '<span class="btn-text">📱 Install App</span>';
            installBtn.addEventListener('click', () => this.installPWA());
            
            // Add to header
            const header = document.querySelector('.header');
            if (header) {
                header.appendChild(installBtn);
            }
        }
    }
    
    // Hide install button
    hideInstallButton() {
        const installBtn = document.getElementById('install-btn');
        if (installBtn) {
            installBtn.remove();
        }
    }
    
    // Install PWA
    async installPWA() {
        if (!this.deferredPrompt) return;
        
        try {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
                this.showNotification('Installing AMIK QR CODE...', 'success');
            } else {
                console.log('User dismissed the install prompt');
            }
            
            this.deferredPrompt = null;
            this.hideInstallButton();
        } catch (error) {
            console.error('Error during PWA installation:', error);
            this.showNotification('Installation failed. Please try again.', 'error');
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for QRCode library to load or fallback to activate
    function initApp() {
        if (typeof QRCode !== 'undefined' || window.QRLibraryReady === 'fallback') {
            new QRCodeGenerator();
        } else {
            // Wait a bit more
            setTimeout(initApp, 200);
        }
    }
    
    setTimeout(initApp, 100);
});

// Add some interactive animations
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.input-section, .output-section');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('preferred-theme', theme);
    updateThemeToggleIcon(theme);
}

function updateThemeToggleIcon(theme) {
    const lightIcon = document.querySelector('.light-icon');
    const darkIcon = document.querySelector('.dark-icon');
    
    if (theme === 'dark') {
        lightIcon.style.display = 'block';
        darkIcon.style.display = 'none';
    } else {
        lightIcon.style.display = 'none';
        darkIcon.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('preferred-theme');
    const systemTheme = getSystemTheme();
    
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme(systemTheme);
    }

    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('preferred-theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    updateTimestamps();
    
    updateLastUpdated();
    
    startMonitoring();
});

function updateTimestamps() {
    const dates = document.querySelectorAll('.incident-date');
    dates.forEach(date => {
        const timestamp = new Date(date.textContent);
        date.textContent = getRelativeTimeString(timestamp);
    });
}

function getRelativeTimeString(date) {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInMinutes < 60) {
        return diffInMinutes === 0 ? 'Just now' : `${diffInMinutes}m ago`;
    }
    if (diffInHours < 24) {
        return `${diffInHours}h ago`;
    }
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function updateLastUpdated() {
    const lastUpdated = document.getElementById('last-updated');
    const updateTime = () => {
        lastUpdated.textContent = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };
    updateTime();
    setInterval(updateTime, 1000);
}

function startMonitoring() {
    const services = document.querySelectorAll('.service-item');
    
    services.forEach(service => {
        const metrics = service.querySelector('.service-metrics');
        const status = service.querySelector('.service-status');
        
        setInterval(() => {
            const metricValues = metrics.querySelectorAll('.metric-value');
            metricValues.forEach(value => {
                const currentValue = parseFloat(value.textContent);
                const label = value.previousElementSibling.textContent.toLowerCase();
                
                let newValue;
                if (label.includes('time')) {
                    newValue = currentValue + (Math.random() - 0.5) * 20;
                    newValue = Math.max(10, Math.min(500, newValue));
                    value.textContent = label.includes('load') ? 
                        newValue.toFixed(1) + 's' : 
                        Math.round(newValue) + 'ms';
                } else if (label.includes('rate') || label.includes('availability')) {
                    newValue = currentValue + (Math.random() - 0.5) * 2;
                    newValue = Math.max(90, Math.min(100, newValue));
                    value.textContent = newValue.toFixed(1) + '%';
                } else if (label.includes('cpu')) {
                    newValue = currentValue + (Math.random() - 0.5) * 10;
                    newValue = Math.max(0, Math.min(100, newValue));
                    value.textContent = Math.round(newValue) + '%';
                }

                if (newValue > 95) {
                    status.className = 'service-status operational';
                    status.textContent = 'Operational';
                } else if (newValue > 90) {
                    status.className = 'service-status degraded';
                    status.textContent = 'Degraded';
                }
            });
        }, 5000);
    });
} 

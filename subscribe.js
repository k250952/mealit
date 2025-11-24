function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

function saveFormData() {
    const formData = {
        fullName: document.getElementById('full-name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        plan: document.querySelector('input[name="plan"]:checked')?.value || '',
        dietaryGoal: document.querySelector('select').value,
        dietaryPreferences: Array.from(document.querySelectorAll('input[name="diet"]:checked')).map(cb => cb.value),
        allergies: document.getElementById('allergies').value,
        spiceLevel: document.querySelectorAll('select')[1]?.value || '',
        favoriteCuisine: document.querySelectorAll('select')[2]?.value || '',
        dislikes: document.getElementById('dislikes').value,
        deliveryDay: document.querySelectorAll('select')[3]?.value || ''
    };
    window.mealItSubscription = formData;
}

function loadFormData() {
    const savedData = window.mealItSubscription;
    if (!savedData) return;
    
    document.getElementById('full-name').value = savedData.fullName || '';
    document.getElementById('email').value = savedData.email || '';
    document.getElementById('phone').value = savedData.phone || '';
    document.getElementById('address').value = savedData.address || '';
    
    if (savedData.plan) {
        const planRadio = document.querySelector(`input[name="plan"][value="${savedData.plan}"]`);
        if (planRadio) planRadio.checked = true;
    }
    
    const selects = document.querySelectorAll('select');
    if (selects[0]) selects[0].value = savedData.dietaryGoal || '';
    if (selects[1]) selects[1].value = savedData.spiceLevel || '';
    if (selects[2]) selects[2].value = savedData.favoriteCuisine || '';
    if (selects[3]) selects[3].value = savedData.deliveryDay || '';
    
    savedData.dietaryPreferences?.forEach(pref => {
        const checkbox = document.querySelector(`input[name="diet"][value="${pref}"]`);
        if (checkbox) checkbox.checked = true;
    });
    
    document.getElementById('allergies').value = savedData.allergies || '';
    document.getElementById('dislikes').value = savedData.dislikes || '';
}

window.addEventListener('DOMContentLoaded', function() {
    loadFormData();

    document.querySelectorAll('.plan-card').forEach(card => {
        card.addEventListener('click', function() {
            this.querySelector('input[type="radio"]').checked = true;
            saveFormData();
        });
    });

    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('change', saveFormData);
        input.addEventListener('input', debounce(saveFormData, 500));
    });

    document.querySelector('.submit-btn').addEventListener('click', function(e) {
        e.preventDefault();
        
        const requiredFields = document.querySelectorAll('[required]');
        let allValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value && field.type !== 'checkbox' && field.type !== 'radio') {
                allValid = false;
                field.style.borderColor = 'red';
            } else if ((field.type === 'checkbox' || field.type === 'radio') && field.required) {
                const groupName = field.name || field.id;
                const checked = document.querySelector(`input[name="${groupName}"]:checked`) || field.checked;
                if (!checked) allValid = false;
            } else {
                field.style.borderColor = '#333';
            }
        });
        
        if (!allValid) {
            alert('Please fill in all required fields marked with *');
            return;
        }
        
        saveFormData();
        alert('Thank you for subscribing to Meal It! Your preferences have been saved. Our team will contact you shortly to confirm your order.');
        
        document.querySelectorAll('input, select, textarea').forEach(field => {
            if (field.type === 'checkbox' || field.type === 'radio') {
                field.checked = false;
            } else {
                field.value = '';
            }
        });
    });
});
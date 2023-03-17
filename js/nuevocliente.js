// IIFE
(function() {

    // Variables
    const form = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {

        connectDB();
        form.addEventListener('submit', validateFields);

    });

    

    // This function validates each field 
    function validateFields(e) {
        
        e.preventDefault();
        
        // Reading input values
        const name      = document.querySelector('#nombre').value;
        const email     = document.querySelector('#email').value;
        const phone     = document.querySelector('#telefono').value;
        const company   = document.querySelector('#empresa').value;

        // Validation
        if (name === '' || email === '' || phone === '' || company === '') {
            printAlert('All fields are required!', 'error');
            return;
        }

        // Object literal for Customer
        const client = {
            name, 
            email, 
            phone, 
            company,
            id: Date.now()
        }
        
        createClient(client);

    }

    // This function creates a Customer
    function createClient(client) {

        // DB
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.add(client);

        transaction.onerror      = () => { printAlert('Unable to register client. Try again!', 'error'); return; };
        transaction.oncomplete   = () => { 
            printAlert('Client registered succesfully!');
            form.reset();
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        };

    }

})();
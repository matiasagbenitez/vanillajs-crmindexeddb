// IIFE
(function() {

    // Variables 
    let clientID;
    
    const nameInput     = document.querySelector('#nombre');
    const emailInput    = document.querySelector('#email');
    const phoneInput    = document.querySelector('#telefono');
    const companyInput  = document.querySelector('#empresa');

    const form          = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {

        connectDB();

        // Getting URL parameters
        const parameters = new URLSearchParams(window.location.search);
        clientID = Number(parameters.get('id'));

        if (clientID) {
            setTimeout(() => {
                getClient(clientID);
            }, 50);
        }

        form.addEventListener('submit', updateClient);

    });

    // This function connect us to the DB
    function connectDB() {
        
        const connection = window.indexedDB.open('crm', 1);
        connection.onerror    = () => { console.error('Error on connecting DB.'); return; };
        connection.onsuccess  = () => { DB = connection.result; console.log('Database conected succesfully.'); }

    }

    // This function get a client
    function getClient(id) {

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.openCursor().onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
                if (cursor.value.id === id) {
                    fillForm(cursor.value);
                }
                cursor.continue();
            }
        }
    }

    // This function fill the form with the data 
    function fillForm(clientData) {

        const { name, email, phone, company } = clientData;

        nameInput.value     = name;
        emailInput.value    = email;
        phoneInput.value    = phone;
        companyInput.value  = company;

    }

    // This function send the data and update the client information
    function updateClient(e) {

        e.preventDefault();

        if (nameInput.value === '' || emailInput.value === '' || phoneInput.value === '' || companyInput.value === '') {
            printAlert('All fields are required!', 'error');
        }

        const updatedClient = {
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            company: companyInput.value,
            id: clientID
        }

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(updatedClient);

        transaction.onerror = () => {
            printAlert('All fields are required!', 'error');
            return;
        }

        transaction.oncomplete = () => {
            printAlert('Client updated succesfully!');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }
    }

})();
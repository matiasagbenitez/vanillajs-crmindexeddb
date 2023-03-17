// This function connect us to the DB
function connectDB() {
        
    const connection = window.indexedDB.open('crm', 1);
    connection.onerror    = () => { console.error('Error on connecting DB.'); return; };
    connection.onsuccess  = () => { DB = connection.result; console.log('Database conected succesfully.'); }

}

// This function prints an alert
function printAlert(message, type) {

    const form = document.querySelector('#formulario');
    const alert = document.querySelector('.alert');

    if (!alert) {
        const div = document.createElement('div');
        div.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'alert');
        if (type === 'error') {
            div.classList.add('bg-red-200', 'border-red-400', 'text-red-700');
        } else {
            div.classList.add('bg-green-200', 'border-green-400', 'text-green-700');
        }
        div.textContent = message;

        form.appendChild(div);

        setTimeout(() => {
            div.remove();
        }, 3000);
    }

}
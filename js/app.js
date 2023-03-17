// IIFE
(function() {

    // Variables
    let DB;
    const clientList = document.querySelector('#listado-clientes');

    document.addEventListener('DOMContentLoaded', () => {

        createDB();
        if (window.indexedDB.open('crm', 1)) {
            getClients();
        }
        clientList.addEventListener('click', deleteClient);

    });

    function createDB() {
        const createDB      = window.indexedDB.open('crm', 1);
        createDB.onerror    = () => { console.error('Error on creating DB.'); return; };
        createDB.onsuccess  = () => { DB = createDB.result; console.log('Database created succesfully.'); }

        createDB.onupgradeneeded = (e) => {

            const result = e.target.result;
            const objectStore = result.createObjectStore('crm', {
                keyPath: 'id',
                autoIncrement: true
            });

            // DB columns configuration
            objectStore.createIndex('name',     'name',     { unique: false });
            objectStore.createIndex('email',    'email',    { unique: true });
            objectStore.createIndex('phone',    'phone',    { unique: false });
            objectStore.createIndex('company',  'company',  { unique: false });

        }

    }

    function getClients() {

        const openDB      = window.indexedDB.open('crm', 1);
        openDB.onerror    = () => { console.error('Error opening DB.'); return; };
        openDB.onsuccess  = () => { 
            console.log('Database opened succesfully.'); 
            DB = openDB.result; 
            
            const transaction = DB.transaction(['crm'], 'readonly');
            const objectStore = transaction.objectStore('crm');

            objectStore.openCursor().onsuccess = (e) => {
                const cursor = e.target.result;
                if (cursor) {

                    const { name, email, phone, company, id } = cursor.value;
                    clientList.innerHTML += `
                    <tr>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${name} </p>
                            <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                            <p class="text-gray-700">${phone}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                            <p class="text-gray-600">${company}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                            <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Edit</a>
                            <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 delete">Delete</a>
                        </td>
                    </tr>`;
                    cursor.continue();
                } else {
                    console.log('EOL');
                }

            };
        }

    }

    function deleteClient(e) {

        if (e.target.classList.contains('delete')) {
            const idDelete = Number(e.target.dataset.cliente);
            console.log(idDelete);
            const confirmDelete = confirm('Delete client?');

            if (confirmDelete) {
                const transaction = DB.transaction(['crm'], 'readwrite');
                const objectStore = transaction.objectStore('crm');
                
                objectStore.delete(idDelete);
                
                transaction.oncomplete = function() {
                    console.log('Deleted succesfully');
                    e.target.parentElement.parentElement.remove();
                }
                transaction.onerror = function() {
                    console.log('Error');
                }

            }
        }

    }

})();
let db;

// Create a new Indexed DB for offline operations

const request = indexedDB.open('BudgetStoreDB', 1);

request.onupgradeneeded = function (event) {
    // create object store called "BudgetStore" and set autoIncrement to true to include an automatic ID
    const db = event.target.result;
    if(db.objectStoreNames.length === 0) {
      const objectStore = db.createObjectStore('BudgetStore', {autoIncrement:true})
    } 
    
};

  // After the Indexed DB is created and the user is online, call the checkDatabase function to transfer any stored transactions
request.onsuccess = function (event) {
    db = event.target.result;
  
    if (navigator.onLine) {
      checkDatabase();
    }
};
  
request.onerror = function (event) {
    console.log(event.target.errorCode)
};

// Creating function to save a transation to the IndexedDB when the API call to add it to the regular DB fails
function saveRecord(record) {
    // create a transaction on the pending db with readwrite access
    // access the pending object store
    // add record to the store with add method.
    const transaction = db.transaction(["BudgetStore"], "readwrite");
    const BudgetStore = transaction.objectStore("BudgetStore");
    BudgetStore.add(record);
}

function checkDatabase() {
    // open a transaction on the pending db
    const transaction = db.transaction(["BudgetStore"], "readwrite");
    // access the pending object store
    const BudgetStore = transaction.objectStore("BudgetStore");
    // get all records from store and set to a variable
    const getAll = BudgetStore.getAll();
  
    // Make the same POST request to add transactions to mongo database
    getAll.onsuccess = function () {
      if (getAll.result.length > 0) {
        fetch('/api/transaction/bulk', {
          method: 'POST',
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then(() => {
            // if successful, open a transaction on the pending db
            // access the pending object store
            // clear all items in the store
            const transaction = db.transaction(["BudgetStore"], "readwrite");
            const BudgetStore = transaction.objectStore("BudgetStore");
            BudgetStore.clear();
          });
      }
    };
}

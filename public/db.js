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
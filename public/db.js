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
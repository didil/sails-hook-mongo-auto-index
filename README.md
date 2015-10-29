# sails-hook-mongo-auto-index

In production, sails.js does not create mongo indexes/unique indexes defined on the models, so manual index creation
 is necessary (https://github.com/balderdashy/sails-mongo/issues/290).  
  
This hook tries to solve this issue by using mongo's ensureIndex function to create the indexes in all environments.  

The indexes are automatically created based on the attributes found on your waterline models : 

````js
name: {
  type: 'string',
  index: true
}
````
Or 
````js
name: {
  type: 'string',
  unique: true
}
````
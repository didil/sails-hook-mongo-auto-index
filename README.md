# sails-hook-mongo-auto-index

In production, sails.js does not create mongo indexes/unique indexes defined on the models, so manual index creation
 is necessary (https://github.com/balderdashy/sails-mongo/issues/290).  
  
This hook tries to solve this issue by using mongo's ensureIndex function to create the indexes in all environments.  

## Install
````bash
npm install --save sails-hook-mongo-auto-index
````

## How To
The only thing you have to do is install the hook.  
When you install the hook, every time the app is lifted, it checks that the indexes in the db match those defined on
your waterline models, when it finds an index defined like the examples below, it creates the necessary indexes if they're
missing.

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

## Contributions
If you think of improvements/bug fixes just fork the repo, make changes and open a pull request ! Thanks
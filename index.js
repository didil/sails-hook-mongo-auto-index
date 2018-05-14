var _ = require('lodash');
var async = require('async');

module.exports = function mongoAutoIndexHook(sails) {

  function getIndexesFromModels() {
    var indexes = [];

    _.forIn(sails.models, function (model,modelKey) {
      if (modelKey == 'archive')
        return;

      mongodb = sails.config.datastores.default.adapter.mongodb
      if(typeof mongodb !== 'undefined' && mongodb !== null){
        sails.log.verbose('sails-hook-mongo-auto-index: ' + 'skipping model ' + modelKey + ', not a sails-mongo model');
        return;
      }

      _.forIn(model.attributes, function (attribute, attributeKey) {
        if (attributeKey == 'id')
          return;
        org = attribute.autoMigrations
        if (typeof org !== 'undefined' && org !== null ? org.unique : void 0) {
          indexes.push(
            {
              model: model,
              attributeKey: attributeKey,
              unique: true
            }
          );
        }

        if (attribute.index === true) {
          indexes.push(
            {
              model: model,
              attributeKey: attributeKey,
              unique: false
            }
          );
        }

      });
    });

    return indexes;
  }

  function createIndexes(indexes, cb) {
    var cbCalled = false; // control variable to call the hook callback only once
    async.each(indexes, createIndex, function (err) {
      if (err) {
        if(!cbCalled){
          cbCalled = true;
          cb(err);
        }
        return;
      }

      if(!cbCalled){
        cbCalled = true;
        cb();
      }
    });
  }

  function createIndex(index, cb) {
    var model = index.model,
      attributeKey = index.attributeKey,
      unique = index.unique;

    model.native(function (err, collection) {
      collection.ensureIndex(attributeKey, {unique: unique}, function (err, result) {
        if (err) {
          return cb(err);
        }

        cb();
      });
    });
  }

  return {
    initialize: function (cb) {
      sails.on('hook:orm:loaded', function () {
        var indexes = getIndexesFromModels();

        createIndexes(indexes, cb);
      });
    }
  };
};

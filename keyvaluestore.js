  var AWS = require('aws-sdk');
  AWS.config.loadFromPath('./config.json');

  var db = new AWS.DynamoDB();

  function keyvaluestore(table) {
    this.LRU = require("lru-cache");
    this.cache = new this.LRU({ max: 500 });
    this.tableName = table;
  };

  /**
   * Initialize the tables
   * 
   */
  keyvaluestore.prototype.init = function(whendone) {
    
    var tableName = this.tableName;
    var self = this;
    
    
    whendone(); //Call Callback function.
  };

  /**
   * Get result(s) by key
   * 
   * @param search
   * 
   * Callback returns a list of objects with keys "inx" and "value"
   */
  
keyvaluestore.prototype.get = async function(search, callback) {
    var self = this;
    
    if (self.cache.get(search))
          callback(null, self.cache.get(search));
    else {
 
    const docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName : this.tableName,
        KeyConditionExpression: "#searchKey = :key",
        ExpressionAttributeNames: {
          "#searchKey": "key"
        },
        ExpressionAttributeValues: {
            ":key": search
        }
    };
    const QueryDB = (dotClient, params) => new Promise((resolve, reject)=>{
      dotClient.query(params, (err, data) => {
        if (err) {
          return reject(err)
        }
        return resolve(data.Items)
      })  
    })
    try {
      let response = await QueryDB(docClient,params)
      response = response.filter(res => res.value)
      self.cache.set(search,response);
      if(response.length == 0){
        callback(null,null);
      } else {
        callback(null,response); 
      }
    } catch (err) {
      console.error(err)
      callback(err,null);
    }
    /*
    const values = response.map( image => {
        const params = {
          TableName: 'images',
          KeyConditionExpression: "#searchKey = :key",
          ExpressionAttributeNames: {
            "#searchKey": "key"
          },
          ExpressionAttributeValues: {
              ":key": image.value
          } 
        }
        return QueryDB(docClient,params);
      })
      let responses = await Promise.all(values)
      responses = responses[0].filter( imagen => imagen.value).map( imagen => imagen.value)
      console.log(responses);
      self.cache.set(search,responses);
      callback(null,responses);
    */
      /*
       * 
       * La función QUERY debe generar un arreglo de objetos JSON son cada
       * una de los resultados obtenidos. (inx, value, key).
       * Al final este arreglo debe ser insertado al cache. Y llamar a callback
       * 
       * Ejemplo:
       *    var items = [];
       *    items.push({"inx": data.Items[0].inx.N, "value": data.Items[0].value.S, "key": data.Items[0].key});
       *    self.cache.set(search, items)
       *    callback(err, items);
       */
    }
  };


  module.exports = keyvaluestore;

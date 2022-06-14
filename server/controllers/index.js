//const Model = require('./models/index.js');

exports.getProducts = (req, res) => {
  //model.find({})
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      console.log(error);
    })
}

exports.getOneProduct = (req, res) => {
  //model.find({})
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      console.log(error);
    })
}

exports.getStyles = (req, res) => {
  //model.find({})
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      console.log(error);
    })
}

exports.getRelated = (req, res) => {
  //model.find({})
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      console.log(error);
    })
}

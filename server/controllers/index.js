const {
  readProducts,
  readOneProduct,
  readStyles,
  readRelated
} = require('./models/index.js');

exports.getProducts = (req, res) => {
  const {page, count} = req.params;
  readProducts(page, count)
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      console.log(error);
      res.sendStatus(500);
    })
}

exports.getOneProduct = (req, res) => {
  const {product_id} = req.params;
  readOneProduct(product_id)
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      console.log(error);
      res.sendStatus(500);
    })
}

exports.getStyles = (req, res) => {
  const {product_id} = req.params;
  readStyles(product_id)
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      console.log(error);
      res.sendStatus(500);
    })
}

exports.getRelated = (req, res) => {
  const {product_id} = req.params;
  readRelated(product_id)
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      console.log(error);
      res.sendStatus(500);
    })
}

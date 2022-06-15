const axios = require("axios");
const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'SDC',
    "max": 20,
  });

readList = function (page = 1, count = 5) {
    return pool.connect().then((client) => {
        const query = `SELECT * FROM products
        LIMIT $2 OFFSET $1`;
        return client
        .query(query, [page * count - count, count])
        .then((res) => {
            client.release();
            return res.rows[0];
        })
        .catch((err) => {
            client.release();
            throw err;
        });
    });
}

readProduct = function (productId) {
    return pool.connect().then((client) => {
        const query = `select row_to_json(t)
        from (
        select products.id, products.name, products.slogan, products.description, products.category, products.default_price,
            (
            select features_and_values from features
            where features.current_product_id = products.id
        ) as features
        from products
        where products.id = $1
        ) t`;
        return client
        .query(query, [productId])
        .then((res) => {
            client.release();
            return res.rows[0].row_to_json;
        })
        .catch((err) => {
            client.release();
            throw err;
        });
    });
}

readStyles = function (productId) {
    return pool.connect().then((client) => {
        const query = `select row_to_json(t)
        from (
        select products.id,
            (
            select array_to_json(array_agg(row_to_json(d)))
            from (
            select styles.style_id, styles.name, styles.original_price, styles.sale_price, styles.default_style, (
                select photos_and_thumbnails from photos
                where photos.style_id = styles.style_id
            ) as photos,
            (
                select size_and_quantity from skus
                where skus.style_id = styles.style_id
            ) as skus
            from styles
            where styles.product_id = products.id
            ) d
        ) as results
        from products
        where products.id = $1
        ) t`;
        return client
        .query(query, [productId])
        .then((res) => {
            client.release();
            return res.rows[0].row_to_json;
        })
        .catch((err) => {
            client.release();
            throw err;
        });
    });
}

readRelated = function (productId) {
    console.log("hello", productId);
    return pool.connect().then((client) => {
        const query = `select array_agg(related_products.related_product_id)
        from related_products
        where related_products.current_product_id = $1`;
        return client
        .query(query, [productId])
        .then((res) => {
            client.release();
            return res.rows[0].array_agg;
        })
        .catch((err) => {
            client.release();
            throw err;
        });
    });
}

module.exports = {
    readProducts: readProducts,
    readOneProduct: readOneProduct,
    readStyles: readStyles,
    readRelated: readRelated
}
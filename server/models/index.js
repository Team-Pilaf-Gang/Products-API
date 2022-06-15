// CONNECTION
require('dotenv').config();
const axios = require("axios");
const { Pool, Client } = require("pg");

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});


// MODELS

readProducts = function (page = 0, count = 5) {
    return pool.connect().then((client) => {
        const text = `SELECT * FROM products LIMIT $2 OFFSET $1`;
        const values = [page, count]
        return client
        .query(text, values)
        .then((res) => {
            client.release();
            return res.rows;
        })
        .catch((err) => {
            client.release();
            throw err;
        });
    });
}

readOneProduct = function (productId) {
    return pool.connect().then((client) => {
        const query = `
        select
            json_build_object(
                'id', products.id,
                'name', products.name,
                'slogan', products.slogan,
                'description', products.description,
                'category', products.category,
                'default_price', products.default_price,
                'features', array_agg(
                    json_build_object(
                        'feature', features.feature,
                        'value', features.value
                    )
                )
            )
        from products
        join features
        on products.id = features.product_id
        where products.id = $1
        group by products.id;`

        return client
        .query(query, [productId])
        .then((res) => {
            console.log(res.rows[0]['json_build_object'])
            client.release();
            return res.rows[0]['json_build_object'];
        })
        .catch((err) => {
            client.release();
            throw err;
        });
    });
}

readStyles = function (productId) {
    return pool.connect().then((client) => {
        const query =`
        select
            json_build_object(
                'product_id', styles.productid,
                'results', array_agg(
                    json_build_object(
                        'style_id', styles.id,
                        'name', styles.name,
                        'original_price', styles.original_price,
                        'sale_price', styles.sale_price,
                        'default?', styles.default_style,
                        'photos', array_agg(
                            json_build_object(
                                'thumbnail_url', photos.thumbnail_url,
                                'url', photos.url
                            )
                        )
                    ),
                'skus', json_build_object(
                    id, json_build_object(
                        'quantity', skus.quantity,
                        'size', skus.size,
                        )
                    )
            )
        from styles
        join photos on photos.styleid = styles.id
        join skus on skus.styleid = styles.id;`

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
    return pool.connect().then((client) => {
        const query = `select array_agg(product_relations.related_product_id)
        from product_relations
        where product_relations.current_product_id = $1`;
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
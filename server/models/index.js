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
        const query = `select row_to_json(t)
        from (
        select products.id, products.name, products.slogan, products.description, products.category, products.default_price,
            (
            select features_and_values from features
            where features.product_id = products.id
        ) as features
        from products
        where products.id = $1
        ) t`;

        const query2 = `select
        json_build_object(
                'id', products.id,
                'name', products.name,
                'slogan', products.email,
                'description', products.description,
                'category', products.category,
                'default_price', products.default_price,
                'features', json_build_object(
                        'id', ur.id,
                        'feature', feature_and_values.feature
                        'value', features_and_values.value
                )
            )
        from products p
        inner join features f on p.product.id = f.product_id`

        return client
        .query(query2, [productId])
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
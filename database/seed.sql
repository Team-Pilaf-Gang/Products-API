DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS features CASCADE;
DROP TABLE IF EXISTS styles CASCADE;
DROP TABLE IF EXISTS skus CASCADE;
DROP TABLE IF EXISTS photos CASCADE;
DROP TABLE IF EXISTS product_relations CASCADE;

-- Creating database for Products API

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT,
    slogan TEXT,
    description TEXT,
    category TEXT,
    default_price INTEGER NOT NULL
);

CREATE TABLE features (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products (id),
    feature TEXT,
    value TEXT
);

CREATE TABLE styles (
    id SERIAL PRIMARY KEY,
    productId INTEGER REFERENCES products (id),
    name TEXT,
    sale_price INTEGER NULL,
    original_price INTEGER,
    default_style BOOLEAN
);

CREATE TABLE skus (
    id SERIAL PRIMARY KEY,
    styleId INTEGER REFERENCES styles (id),
    size TEXT,
    quantity INTEGER
);

CREATE TABLE photos (
    id SERIAL PRIMARY KEY,
    styleId INTEGER REFERENCES styles (id),
    url TEXT,
    thumbnail_url TEXT
);

CREATE TABLE product_relations (
    id SERIAL PRIMARY KEY,
    current_product_id INTEGER NOT NULL REFERENCES products (id),
    related_product_id INTEGER NOT NULL REFERENCES products (id)
);

COPY products
FROM '/Users/victortran/Hack Reactor Bootcamp/SDC/data/product.csv'
DELIMITER ',' HEADER CSV;

COPY features
FROM '/Users/victortran/Hack Reactor Bootcamp/SDC/data/features.csv'
DELIMITER ',' HEADER CSV;

COPY styles
FROM '/Users/victortran/Hack Reactor Bootcamp/SDC/data/styles.csv'
DELIMITER ',' NULL as 'null' HEADER CSV;

COPY skus
FROM '/Users/victortran/Hack Reactor Bootcamp/SDC/data/skus.csv'
DELIMITER ',' HEADER CSV;

COPY photos
FROM '/Users/victortran/Hack Reactor Bootcamp/SDC/data/photos.csv'
DELIMITER ',' HEADER CSV;

COPY product_relations
FROM '/Users/victortran/Hack Reactor Bootcamp/SDC/data/related.csv'
DELIMITER ',' HEADER CSV
WHERE current_product_id != 0 AND related_product_id != 0;


-- create index for foreign keys

CREATE INDEX product_id ON features(product_id);
CREATE INDEX productId ON styles(productId);
CREATE INDEX styleIdSkus ON skus(styleId);
CREATE INDEX styleIdPhotos ON photos(styleId);
CREATE INDEX current_product_id ON product_relations(current_product_id);



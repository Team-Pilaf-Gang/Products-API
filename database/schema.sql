
-- Creating database for Products API

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name TEXT,
    slogan TEXT,
    description TEXT, 
    category TEXT, 
    default_price INTEGER NOT NULL
);

CREATE TABLE features (
    feature_id SERIAL PRIMARY KEY, 
    product_id INTEGER REFERENCES products, 
    feature TEXT, 
    value TEXT
);

CREATE TABLE styles (
    styles_id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products,
    name TEXT,
    original_price INTEGER,
    sale_price INTEGER,
    default BOOLEAN
);

CREATE TABLE skus (
    skus_id SERIAL PRIMARY KEY, 
    style_id INTEGER REFERENCES styles,
    quantity INTEGER,
    size TEXT
);

CREATE TABLE photos (
    photo_id SERIAL PRIMARY KEY, 
    styles_id INTEGER REFERENCES styles, 
    url TEXT, 
    thumbnail_url TEXT
);

CREATE TABLE product_relations (
    id SERIAL PRIMARY KEY, 
    product_id1 INTEGER NOT NULL REFERENCES products (product_id),
    product_id2 INTEGER NOT NULL REFERENCES products (product_id)
);
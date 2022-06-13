
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
    sale_price INTEGER,
    original_price INTEGER,
    default_style BOOLEAN
);

CREATE TABLE skus (
    id SERIAL PRIMARY KEY, 
    styleId INTEGER REFERENCES styles (id),
    quantity INTEGER,
    size TEXT
);

CREATE TABLE photos (
    id SERIAL PRIMARY KEY, 
    stylesId INTEGER REFERENCES styles (id), 
    url TEXT, 
    thumbnail_url TEXT
);

CREATE TABLE product_relations (
    id SERIAL PRIMARY KEY, 
    current_product_id INTEGER NOT NULL REFERENCES products (productId),
    related_product_id INTEGER NOT NULL REFERENCES products (productId)
);
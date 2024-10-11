/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import { ClientError, errorMiddleware } from './lib/index.js';

/*

type User = {
  userId: number;
  username: string;
  hashedPassword: string;
};

type Auth = {
  username: string;
  password: string;
};

*/

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// const hashKey = process.env.TOKEN_SECRET;
// if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

const app = express();
app.use(express.json()); // Middleware for parsing JSON bodies

// Sign-up route
/*
app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(400, 'username and password are required fields');
    }

    const hashedPassword = await argon2.hash(password);
    const sql = `
      INSERT INTO "users" ("username", "hashedPassword")
      VALUES ($1, $2)
      RETURNING "userId", "username", "createdAt"
    `;
    const params = [username, hashedPassword];
    const result = await db.query<User>(sql, params);
    const [user] = result.rows;

    // Create a JWT token
    const payload = { userId: user.userId, username };
    const token = jwt.sign(payload, hashKey);

    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
});

// Sign-in route
app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body as Partial<Auth>;
    if (!username || !password) {
      throw new ClientError(401, 'invalid login');
    }

    const sql = `
      SELECT "userId", "hashedPassword"
      FROM "users"
      WHERE "username" = $1
    `;
    const params = [username];
    const result = await db.query<User>(sql, params);
    const [user] = result.rows;

    if (!user) {
      throw new ClientError(401, 'invalid login');
    }

    const { userId, hashedPassword } = user;
    if (!(await argon2.verify(hashedPassword, password))) {
      throw new ClientError(401, 'invalid login');
    }

    // Create a JWT token
    const payload = { userId, username };
    const token = jwt.sign(payload, hashKey);

    res.json({ token, user: payload });
  } catch (err) {
    next(err);
  }
});

*/

// ROUTES FOR FAVORITES
// WILL EVENTUALLY HAVE TO CHANGE WHEN IMPLEMENTING USER MANAGEMENT

app.post('/api/favorites', async (req, res, next) => {
  try {
    const { menuItemId } = req.body;
    const userId = 1;
    const sql = `
      INSERT INTO "favorites" ("userId", "menuItemId")
      VALUES ($1, $2)
      RETURNING "favoriteId", "userId", "menuItemId"
      `;
    const params = [userId, menuItemId];
    const result = await db.query(sql, params);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.get('/api/favorites', async (req, res, next) => {
  try {
    const userId = 1;
    const sql = `
      SELECT "menuItems".*
      FROM "favorites"
      JOIN "menuItems" ON "favorites"."menuItemId" = "menuItems"."menuItemId"
      WHERE "favorites"."userId" = $1
    `;
    const params = [userId];
    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// ROUTE THAT IS USED FOR DELETING A MENU ITEM THINGY FROM THE FAVS PAGE
// wat does parseInt do?
app.delete(`/api/favorites/:favoriteId`, async (req, res, next) => {
  const favoriteId = req.params.favoriteId;

  // Log the favoriteId to ensure it's passed correctly
  console.log('Favorite ID to delete:', favoriteId);

  try {
    const sql = `
      DELETE FROM "favorites"
      WHERE "favoriteId" = $1
      RETURNING "favoriteId"
    `;
    const params = [favoriteId];
    const result = await db.query(sql, params);

    // If no rows were affected, return a 404
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    // Successful deletion
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

app.post('/api/cart', async (req, res, next) => {
  try {
    const { menuItemId, quantity } = req.body;
    const userId = 1; // will have to change once i implement user management
    const sql = `
      INSERT INTO "cart" ("userId", "menuItemId", "quantity")
      VALUES ($1, $2, $3)
      RETURNING "cartId", "userId", "menuItemId", "quantity"
    `;
    const params = [userId, menuItemId, quantity];
    const result = await db.query(sql, params);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// retirieves cart items
app.get('/api/cart', async (req, res, next) => {
  try {
    const userId = 1; // Replace with actual userId from authenticated user
    const sql = `
      SELECT "cart".*, "menuItems".name, "menuItems".price
      FROM "cart"
      JOIN "menuItems" ON "cart"."menuItemId" = "menuItems"."menuItemId"
      WHERE "cart"."userId" = $1
    `;
    const params = [userId];
    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Updates item quantity in cart
app.put('/api/cart/:cartId', async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const { quantity } = req.body;
    const sql = `
      UPDATE "cart"
      SET "quantity" = $1
      WHERE "cartId" = $2
      RETURNING "cartId", "quantity"
    `;
    const params = [quantity, cartId];
    const result = await db.query(sql, params);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Removess item from cart
app.delete('/api/cart/:cartId', async (req, res, next) => {
  const { cartId } = req.params;
  try {
    const sql = `
      DELETE FROM "cart"
      WHERE "cartId" = $1
      RETURNING "cartId"
    `;
    const params = [cartId];
    const result = await db.query(sql, params);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
app.use(express.static(uploadsStaticDir));

// Menu items route
app.get('/api/menuItems', async (req, res, next) => {
  try {
    const rows = await db.query('SELECT * FROM "menuItems"');
    res.json(rows.rows);
  } catch (err) {
    next(err);
  }
});

// Handles paths that aren't handled by any other route handler.
app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT);
});

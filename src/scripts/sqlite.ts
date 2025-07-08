import Database from '@tauri-apps/plugin-sql';

const DB_PATH = 'sqlite:pos-store.db';

let dbPromise: Promise<any> | null = null;

async function getDb() {
    if (!dbPromise) {
        dbPromise = Database.load(DB_PATH);
    }
    return dbPromise;
}

export async function initDb() {
    const db = await getDb();

    await db.execute(`
        CREATE TABLE IF NOT EXISTS categories (
            id TEXT PRIMARY KEY,
            displayname TEXT NOT NULL,
            thumbnail TEXT
        )
    `);
    await db.execute(`
        CREATE TABLE IF NOT EXISTS items (
            id TEXT PRIMARY KEY,
            displayname TEXT NOT NULL,
            price REAL NOT NULL,
            thumbnail TEXT,
            categories TEXT -- JSON array of category ids
        )
    `);
}

export async function getCategories() {
    const db = await getDb();
    return await db.select(`SELECT * FROM categories`);
}

export async function addCategory(category: {id: string, displayname: string, thumbnail: string}) {
    const db = await getDb();
    await db.execute(
        `INSERT INTO categories (id, displayname, thumbnail) VALUES (?, ?, ?)`,
        [category.id, category.displayname, category.thumbnail]
    );
}

export async function updateCategory(category: {id: string, displayname: string, thumbnail: string}) {
    const db = await getDb();
    await db.execute(
        `UPDATE categories SET displayname = ?, thumbnail = ? WHERE id = ?`,
        [category.displayname, category.thumbnail, category.id]
    );
}

export async function deleteCategory(id: string) {
    const db = await getDb();
    await db.execute(`DELETE FROM categories WHERE id = ?`, [id]);
}

export async function getItems() {
    const db = await getDb();
    const items = await db.select(`SELECT * FROM items`);
    // Parse categories JSON
    return items.map((item: any) => ({
        ...item,
        categories: item.categories ? JSON.parse(item.categories) : []
    }));
}

export async function addItem(item: {id: string, displayname: string, price: number, thumbnail: string, categories: string[]}) {
    const db = await getDb();
    await db.execute(
        `INSERT INTO items (id, displayname, price, thumbnail, categories) VALUES (?, ?, ?, ?, ?)`,
        [item.id, item.displayname, item.price, item.thumbnail, JSON.stringify(item.categories)]
    );
}

export async function updateItem(item: {id: string, displayname: string, price: number, thumbnail: string, categories: string[]}) {
    const db = await getDb();
    await db.execute(
        `UPDATE items SET displayname = ?, price = ?, thumbnail = ?, categories = ? WHERE id = ?`,
        [item.displayname, item.price, item.thumbnail, JSON.stringify(item.categories), item.id]
    );
}

export async function deleteItem(id: string) {
    const db = await getDb();
    await db.execute(`DELETE FROM items WHERE id = ?`, [id]);
}
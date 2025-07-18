import Database from '@tauri-apps/plugin-sql';

const DB_PATH = 'sqlite:pos-store-4.db';

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
            displayname TEXT NOT NULL
        )
    `);
    await db.execute(`
        CREATE TABLE IF NOT EXISTS items (
            id TEXT PRIMARY KEY,
            displayname TEXT NOT NULL,
            price REAL NOT NULL,
            categories TEXT, -- JSON array of category ids
            barcode TEXT UNIQUE, -- Optional unique barcode
            thumbnail TEXT -- Path to thumbnail image
        )
    `);
}

export async function getCategories() {
    const db = await getDb();
    return await db.select(`SELECT * FROM categories`);
}

export async function addCategory(category: {id: string, displayname: string}) {
    const db = await getDb();
    await db.execute(
        `INSERT INTO categories (id, displayname) VALUES (?, ?)`,
        [category.id, category.displayname]
    );
}

export async function updateCategory(category: {id: string, displayname: string}) {
    const db = await getDb();
    await db.execute(
        `UPDATE categories SET displayname = ? WHERE id = ?`,
        [category.displayname, category.id]
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
        categories: item.categories ? JSON.parse(item.categories) : [],
        thumbnail: item.thumbnail || null
    }));
}

export async function addItem(item: {id: string, displayname: string, price: number, categories: string[], barcode?: string, thumbnail?: string}) {
    const db = await getDb();
    await db.execute(
        `INSERT INTO items (id, displayname, price, categories, barcode, thumbnail) VALUES (?, ?, ?, ?, ?, ?)`,
        [item.id, item.displayname, item.price, JSON.stringify(item.categories), item.barcode || null, item.thumbnail || null]
    );
}

export async function updateItem(item: {id: string, displayname: string, price: number, categories: string[], barcode?: string, thumbnail?: string}) {
    const db = await getDb();
    await db.execute(
        `UPDATE items SET displayname = ?, price = ?, categories = ?, barcode = ?, thumbnail = ? WHERE id = ?`,
        [item.displayname, item.price, JSON.stringify(item.categories), item.barcode || null, item.thumbnail || null, item.id]
    );
}

export async function deleteItem(id: string) {
    const db = await getDb();
    await db.execute(`DELETE FROM items WHERE id = ?`, [id]);
}

// Function to check if a barcode already exists
export async function barcodeExists(barcode: string): Promise<boolean> {
    try {
        const db = await getDb();
        const result = await db.select(`SELECT COUNT(*) as count FROM items WHERE barcode = ?`, [barcode]);
        return result[0].count > 0;
    } catch (error) {
        console.error('Error checking barcode existence:', error);
        return false; // Assume it doesn't exist if we can't check
    }
}

// Function to generate a unique barcode
export async function generateUniqueBarcode(): Promise<string> {
    try {
        let barcode: string;
        let exists: boolean;
        let attempts = 0;
        const maxAttempts = 10;
        
        do {
            // Generate a 12-digit barcode (EAN-12 format)
            barcode = (Math.floor(Math.random() * 900000000000) + 100000000000).toString();
            exists = await barcodeExists(barcode);
            attempts++;
            
            if (attempts >= maxAttempts) {
                // Fallback: generate a timestamp-based barcode if we can't find a unique one
                barcode = Date.now().toString().slice(-12).padStart(12, '0');
                exists = await barcodeExists(barcode);
                if (!exists) {
                    return barcode;
                }
                throw new Error('Failed to generate unique barcode after maximum attempts');
            }
        } while (exists);
        
        return barcode;
    } catch (error) {
        console.error('Error generating unique barcode:', error);
        // Final fallback: use timestamp + random number
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return timestamp + random;
    }
}
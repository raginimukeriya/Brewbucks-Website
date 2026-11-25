/* BrewBucks - mini database on top of localStorage
   Each "table" is one localStorage key holding an array of records.
   Existing tables: "users" (signup), "orders" (payment).
   Needs js/main.js loaded first (readJSON / writeJSON). */

const DB = {
    all(table) {
        const rows = readJSON(table, []);
        return Array.isArray(rows) ? rows : [];
    },

    // find("orders", { userEmail: "a@b.com" }) -> all records matching every field
    find(table, query) {
        const q = query || {};
        return this.all(table).filter(row =>
            Object.keys(q).every(key => row[key] === q[key])
        );
    },

    findOne(table, query) {
        return this.find(table, query)[0] || null;
    },

    insert(table, record) {
        const rows = this.all(table);
        const row = Object.assign({
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            createdAt: new Date().toISOString()
        }, record);

        rows.push(row);
        writeJSON(table, rows);
        return row;
    },

    update(table, id, changes) {
        const rows = this.all(table);
        const row = rows.find(r => r.id === id);
        if (!row) return null;

        Object.assign(row, changes);
        writeJSON(table, rows);
        return row;
    },

    remove(table, id) {
        const rows = this.all(table);
        const left = rows.filter(r => r.id !== id);
        writeJSON(table, left);
        return left.length !== rows.length;
    }
};

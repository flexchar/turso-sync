// https://docs.turso.tech/features/embedded-replicas
console.log(`Turso Embedded Replica\n⏰ ${new Date().toISOString()}`);

import { createClient } from '@libsql/client';

const {
    //
    LIBSQL_DB_URL,
    LIBSQL_DB_AUTH_TOKEN,
    OUTPUT_DB_PATH,
    SYNC_INTERVAL = false,
} = process.env;

console.log({
    LIBSQL_DB_URL,
    LIBSQL_DB_AUTH_TOKEN,
    OUTPUT_DB_PATH,
    SYNC_INTERVAL,
    CWD: process.cwd(),
});

if (!LIBSQL_DB_URL) {
    console.error('Missing LIBSQL_DB_URL');
    process.exit(1);
}

if (!LIBSQL_DB_AUTH_TOKEN) {
    console.error('Missing LIBSQL_DB_AUTH_TOKEN');
    process.exit(1);
}

if (!OUTPUT_DB_PATH || !OUTPUT_DB_PATH.endsWith('.db')) {
    console.error('Missing OUTPUT_DB_PATH or invalid file extension');
    console.error(
        'OUTPUT_DB_PATH must end with .db, such as /path/to/turso.db',
    );
    process.exit(1);
}

// Ensure the file exists
import path from 'path';
const absolutePath = path.resolve(OUTPUT_DB_PATH);
console.log(`Output DB Path: ${absolutePath}`);
// import fs from 'fs';
// fs.existsSync(OUTPUT_DB_PATH) || fs.writeFileSync(OUTPUT_DB_PATH, '');
// Version 0.8.0 is broken and will complain about missing file.

const client = createClient({
    url: `file:${absolutePath}`,
    syncUrl: LIBSQL_DB_URL,
    authToken: LIBSQL_DB_AUTH_TOKEN,
    // syncInterval: 60, // will do it manually
});

let isSyncing = false;
async function sync() {
    if (isSyncing) {
        console.log('Sync already in progress');
        return;
    }
    isSyncing = true;
    console.log(`Syncing ${LIBSQL_DB_URL} -> ${OUTPUT_DB_PATH}`);
    console.time(`sync()`);
    await client.sync().catch((err) => {
        console.error('Error syncing', err);
        process.exit(1);
    });
    console.timeEnd('sync()');
    // Blank line
    console.log();
    isSyncing = false;

    if (SYNC_INTERVAL) {
        const interval = parseInt(SYNC_INTERVAL) * 1000;
        setTimeout(sync, interval);
    }
}

SYNC_INTERVAL && console.log(`Will sync every ${SYNC_INTERVAL} seconds`);
sync();

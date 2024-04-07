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
    console.error('OUTPUT_DB_PATH must end with .db, such as /path/to/turso.db');
    process.exit(1);
}

// Listen to SIGINT and SIGTERM signals
process.on('SIGINT', () => {
    console.log('Received SIGINT');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM');
    process.exit(0);
});

const client = createClient({
    url: `file:${OUTPUT_DB_PATH}`,
    syncUrl: LIBSQL_DB_URL,
    authToken: LIBSQL_DB_AUTH_TOKEN,
    // Not documented in the turso docs
    // syncInterval: 60,
});

async function sync() {
    console.log(`Syncing ${LIBSQL_DB_URL} -> ${OUTPUT_DB_PATH}`);
    console.time(`sync()`);
    await client.sync();
    console.timeEnd('sync()');
    // Blank line
    console.log();
}

if (SYNC_INTERVAL) {
    const interval = parseInt(SYNC_INTERVAL) * 1000;
    console.log(`Will sync every ${SYNC_INTERVAL} seconds`);
    setInterval(sync, interval);
} else sync();

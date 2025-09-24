import { Pool, PoolClient } from 'pg';
import config from './config';

class Database {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: config.database.host,
      port: config.database.port,
      database: config.database.name,
      user: config.database.user,
      password: config.database.password,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
    });

    this.pool.on('error', (err: Error) => {
      console.error('Unexpected error on idle client:', err);
      process.exit(-1);
    });
  }

  // Get a client from the pool
  async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  // Execute a query
  async query(text: string, params?: any[]): Promise<any> {
    const client = await this.getClient();
    try {
      const result = await client.query(text, params);
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Execute a transaction
  async transaction(callback: (client: PoolClient) => Promise<any>): Promise<any> {
    const client = await this.getClient();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Transaction error:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Test database connection
  async testConnection(): Promise<boolean> {
    try {
      const client = await this.getClient();
      const result = await client.query('SELECT NOW()');
      client.release();
      console.log('✅ Database connected successfully at:', result.rows[0].now);
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }
  }

  // Close the pool
  async close(): Promise<void> {
    await this.pool.end();
    console.log('📦 Database pool closed');
  }
}

export default new Database();
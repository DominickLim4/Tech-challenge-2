import pg from "pg";
import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
dotenv.config({ path: envFile });

class DatabaseConfig {
  private static pool: pg.Pool;

  static getPool(): pg.Pool {
    if (!DatabaseConfig.pool) {
      DatabaseConfig.pool = new pg.Pool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || "5432"),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
      DatabaseConfig.pool.on("connect", () => {
        console.log("Conectado ao PostgreSQL");
      });
      DatabaseConfig.pool.on("error", (err) => {
        console.error("Erro no PostgreSQL:", err.message);
      });
    }
    return DatabaseConfig.pool;
  }

  static async initializeDatabase(): Promise<void> {
    const pool = DatabaseConfig.getPool();
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS posts (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          author TEXT NOT NULL,
          "createdAt" TIMESTAMP NOT NULL,
          "updatedAt" TIMESTAMP NOT NULL
        )
      `);
      console.log("Tabela de posts inicializada");
    } catch (err) {
      console.error("Erro ao criar tabela:", err);
    }
  }

  static async close(): Promise<void> {
    if (DatabaseConfig.pool) {
      await DatabaseConfig.pool.end();
      console.log("Conexao fechada");
    }
  }
}

export { DatabaseConfig };

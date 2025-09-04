import Database from 'better-sqlite3';
import { getDatabase } from './database';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export class TodoService {
  private readonly userID: string;

  constructor(userID: string) {
    this.userID = userID;
  }

  private async withDatabase<T>(operation: (db: Database.Database) => T): Promise<T> {
    const db = getDatabase();
    return operation(db);
  }

  async get(): Promise<Todo[]> {
    return this.withDatabase(db => {
      const stmt = db.prepare(`
        SELECT id, text, completed 
        FROM todos 
        WHERE user_id = ? 
        ORDER BY completed ASC, id ASC
      `);
      
      const rows = stmt.all(this.userID) as Array<{
        id: string;
        text: string;
        completed: number;
      }>;

      return rows.map(row => ({
        id: row.id,
        text: row.text,
        completed: Boolean(row.completed)
      }));
    });
  }

  async add(todoText: string): Promise<Todo[]> {
    return this.withDatabase(db => {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: todoText,
        completed: false
      };

      const stmt = db.prepare(`
        INSERT INTO todos (id, user_id, text, completed)
        VALUES (?, ?, ?, ?)
      `);

      stmt.run(newTodo.id, this.userID, newTodo.text, newTodo.completed ? 1 : 0);
      
      // Get updated todos in the same connection
      const selectStmt = db.prepare(`
        SELECT id, text, completed 
        FROM todos 
        WHERE user_id = ? 
        ORDER BY completed ASC, id ASC
      `);
      
      const rows = selectStmt.all(this.userID) as Array<{
        id: string;
        text: string;
        completed: number;
      }>;

      return rows.map(row => ({
        id: row.id,
        text: row.text,
        completed: Boolean(row.completed)
      }));
    });
  }

  async delete(todoID: string): Promise<Todo[]> {
    return this.withDatabase(db => {
      const stmt = db.prepare(`
        DELETE FROM todos 
        WHERE id = ? AND user_id = ?
      `);

      stmt.run(todoID, this.userID);
      
      // Get updated todos in the same connection
      const selectStmt = db.prepare(`
        SELECT id, text, completed 
        FROM todos 
        WHERE user_id = ? 
        ORDER BY completed ASC, id ASC
      `);
      
      const rows = selectStmt.all(this.userID) as Array<{
        id: string;
        text: string;
        completed: number;
      }>;

      return rows.map(row => ({
        id: row.id,
        text: row.text,
        completed: Boolean(row.completed)
      }));
    });
  }

  async markCompleted(todoID: string): Promise<Todo[]> {
    return this.withDatabase(db => {
      const stmt = db.prepare(`
        UPDATE todos 
        SET completed = 1 
        WHERE id = ? AND user_id = ?
      `);

      stmt.run(todoID, this.userID);
      
      // Get updated todos in the same connection
      const selectStmt = db.prepare(`
        SELECT id, text, completed 
        FROM todos 
        WHERE user_id = ? 
        ORDER BY completed ASC, id ASC
      `);
      
      const rows = selectStmt.all(this.userID) as Array<{
        id: string;
        text: string;
        completed: number;
      }>;

      return rows.map(row => ({
        id: row.id,
        text: row.text,
        completed: Boolean(row.completed)
      }));
    });
  }
}
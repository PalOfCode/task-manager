const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const db = new sqlite3.Database(path.join(__dirname, "taskmanager.db"));
function run(sql,p=[]){return new Promise((r,j)=>db.run(sql,p,function(e){e?j(e):r({id:this.lastID,changes:this.changes})}))}
function get(sql,p=[]){return new Promise((r,j)=>db.get(sql,p,(e,row)=>e?j(e):r(row)))}
function all(sql,p=[]){return new Promise((r,j)=>db.all(sql,p,(e,rows)=>e?j(e):r(rows)))}
async function initDatabase(){
 await run(`CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,email TEXT NOT NULL UNIQUE,password_hash TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
 await run(`CREATE TABLE IF NOT EXISTS tasks(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER NOT NULL,title TEXT NOT NULL,description TEXT DEFAULT '',priority TEXT NOT NULL DEFAULT 'Medium',status TEXT NOT NULL DEFAULT 'To Do',due_date TEXT DEFAULT '',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE)`);
 await run(`CREATE TABLE IF NOT EXISTS settings(user_id INTEGER PRIMARY KEY,theme TEXT NOT NULL DEFAULT 'light',notifications INTEGER NOT NULL DEFAULT 1,default_priority TEXT NOT NULL DEFAULT 'Medium',FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE)`);
 await run(`CREATE TABLE IF NOT EXISTS password_resets(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER NOT NULL,token TEXT NOT NULL UNIQUE,expires_at INTEGER NOT NULL,used INTEGER NOT NULL DEFAULT 0,FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE)`);
}
module.exports={db,run,get,all,initDatabase};

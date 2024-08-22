from flask import g
import sqlite3

class Database:
    def __init__(self, db_name="database"):
        self.db_name =  db_name 
        self.keys = ["id", "name", "description", "price"]

        self.initialize_db()


    def initialize_db(self):
        con = sqlite3.connect(f"{self.db_name}.db")
        con.execute("CREATE TABLE IF NOT EXISTS tbl(id INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT  NOT NULL, description TEXT NOT NULL, price INTEGER NOT NULL)")

        con.commit()

        print(f"Database '{self.db_name}' created successfully")
    
    def get_db(self):
        if 'db' not in g:
            g.db = sqlite3.connect(f"{self.db_name}.db")
        
        return g.db
    
    def close_db(self):
        db = g.pop("db", None)

        if db is not None:
            db.close()
    
    # create record
    def create_record(self, name, description, price):
        con = self.get_db()
        cursor = con.cursor()

        query = "INSERT INTO tbl (name, description, price) VALUES (?, ?, ?)"
        values = (name, description, price)
        cursor.execute(query, values)
        con.commit()

        print("Record successfully created")

    # update record
    def update_record(self, id, name, description, price):
        con = self.get_db()
        cursor = con.cursor()

        query = "UPDATE tbl SET name = ?, description = ?, price = ? WHERE id = ?"
        values = (name, description, price, id)
        
        cursor.execute(query, values)
        con.commit()
        
        get_query = "SELECT * FROM tbl WHERE id = ?"
        cursor.execute(get_query, (id,))

        record = dict(zip(self.keys, cursor.fetchone()))

        return record

    # display all records
    def display_all_records(self):
        con = self.get_db()
        cursor = con.cursor()

        record_list = []

        cursor.execute("SELECT * FROM tbl")

        for record in cursor:
            record_list.append(record)
        
        records = [dict(zip(self.keys, record)) for record in record_list]

        return records
        
    # display record by id
    def display_record(self, id):
        con = self.get_db()
        cursor = con.cursor()

        check_query = "SELECT 1 FROM tbl WHERE id = ?"

        query = "SELECT * FROM tbl WHERE id = ?"
        id = id

        cursor.execute(check_query, (id,))

        if cursor.fetchone() is not None:
            cursor.execute(query, (id,))
            record = dict(zip(self.keys, cursor.fetchone()))

            return record
        else:
            return None
    
    # delete record by id
    def delete_record(self, id):
        con = self.get_db()
        cursor = con.cursor()

        check_query = "SELECT 1 FROM tbl WHERE id = ?"
        

        query = "DELETE FROM tbl WHERE id = ?"
        id = id

        cursor.execute(check_query, (id,))

        if cursor.fetchone() is not None:
            cursor.execute(query, (id,))
            con.commit()

            return f"Item {id} successfully deleted"
        else:
            return None
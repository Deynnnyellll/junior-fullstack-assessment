from flask import Flask, jsonify, request
from flask_cors import CORS
from database import Database


app = Flask(__name__)
CORS(app)

db = Database()

@app.before_request
def before_request():
    db.get_db()

@app.teardown_appcontext
def teardown(exception):
    db.close_db()

# display all items
@app.route('/api/items', methods=['GET'])
def get_all_items():
    items = db.display_all_records()

    return jsonify(items)


# create an item
@app.route('/api/items', methods=['POST'])
def create_item():
    data = request.json

    name = data.get("name")
    description = data.get("description")
    price = data.get("price")

    if name is not None and description is not None and price is not None or description != "":
        try:
            if price > 0:
                db.create_record(name, description, price)
                return jsonify([{"success": "Item successfully created"}, {"name": name, "description": description, "price": price}]), 200
            else:
                return jsonify({"error": "price should not be a negative integer"}), 400 
        except Exception as e:
            return jsonify ({"error": f"{e}"}), 500
    else:
        return jsonify({"error": "all the values should not be null"}), 400

# display an item by id
@app.route('/api/items/<id>', methods=['GET'])
def get_item(id):
    item = db.display_record(id)

    if item is not None:
        return jsonify(item), 200
    else:
        return jsonify({"error": "item not found"}), 404

# update an item by id
@app.route('/api/items/<id>', methods=['PUT'])
def update_item(id):
        data = request.json
        name = data.get("name")
        description = data.get("description")
        price = data.get("price")
        
        if name is not None and description is not None and price is not None:   
            if price > 0:
                try:
                    db.update_record(id, name, description, price)
                    return jsonify ({"success": "Item successfully updated"}), 200
                except Exception as e:
                    return jsonify({"error": f"{e}"}), 500
            else:
                return jsonify({"error": f"price should not be a negative integer"}), 400   
        else:
            return jsonify({"error": "all the values should not be null"}), 400
    
# delete an item by id
@app.route('/api/items/<id>', methods=['DELETE'])
def delete_item(id):
    result = db.delete_record(id)
    try:
        if result is None:
            return jsonify({"error": "item not found"}), 404
        else:
            return jsonify({"success": result}), 200
    except Exception as e:
        return jsonify({"error": f"{e}"}), 500



if __name__ == "__main__":
    app.run(debug=True)
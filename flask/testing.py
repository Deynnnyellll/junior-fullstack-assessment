import unittest
import json
from app import app
from database import Database

# unit test for rest api
class FlaskAppTests(unittest.TestCase):
    global db
    db = Database()

    @classmethod
    def setUpClass(cls):
        cls.client = app.test_client()
        cls.client.testing = True

    def setUp(self):
        self.app = app
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.get_db() 

    def tearDown(self):
        db.close_db() 

    # LOGIN
    def test_login_success(self):
        response = self.client.post('/api/login', json={
            'username': 'user',
            'password': 123456
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn('access_token', json.loads(response.data))

    def test_login_failure(self):
        response = self.client.post('/api/login', json={
            'username': 'wrong_user',
            'password': 123456
        })
        self.assertEqual(response.status_code, 404)
        self.assertIn('error', json.loads(response.data))

    # GET ALL ITEMS
    def test_get_all_items(self):
        response = self.client.get('/api/items', headers={
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6Z…0OTl9.jfnn37MVASMUPBqTTy-epjFTr6zRQNxD5KiaNgQDWwQe'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(json.loads(response.data), list)

    # CREATE ITEM
    def test_create_item_success(self):
        response = self.client.post('/api/items', json={
            'name': 'New Item',
            'description': 'Item description',
            'price': 100
        })
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.data)
        self.assertEqual(response_data[0]['success'], 'Item successfully created')

    def test_create_item_failure(self):
        response = self.client.post('/api/items', json={
            'name': 'New Item',
            'description': 'Item description',
            'price': -10
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', json.loads(response.data))

    # GET ITEM BY ID
    def test_get_item_success(self):
        item_id = 5
        response = self.client.get(f'/api/items/{item_id}')
        self.assertEqual(response.status_code, 200)
        self.assertIn('name', json.loads(response.data))

    def test_get_item_failure(self):
        response = self.client.get('/api/items/40000')
        self.assertEqual(response.status_code, 404)
        self.assertIn('error', json.loads(response.data))

    
    # UPDATE ITEM BY ID
    def test_update_item_success(self):
        item_id = "input some existing id here"
        response = self.client.put(f'/api/items/{item_id}', json={
            'name': 'Updated Item',
            'description': 'Updated description',
            'price': 150
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn('success', json.loads(response.data))

    def test_update_item_failure(self):
        response = self.client.put('/api/items/40000', json={
            'name': 'Updated Item',
            'description': 'Updated description',
            'price': -150
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', json.loads(response.data))

    
    # DELETE FUNCTION
    def test_delete_item_success(self):
        item_id = "input existing id in the database here"
        response = self.client.delete(f'/api/items/{item_id}')
        self.assertEqual(response.status_code, 200)
        self.assertIn('success', json.loads(response.data))

    def test_delete_item_failure(self):
        response = self.client.delete('/api/items/40000')
        self.assertEqual(response.status_code, 404)
        self.assertIn('error', json.loads(response.data))

if __name__ == '__main__':
    unittest.main()

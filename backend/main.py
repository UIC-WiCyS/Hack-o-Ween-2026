from flask import Flask, render_template, jsonify
from flask_cors import CORS
from flask import request
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

app = Flask(__name__)
CORS(app)

load_dotenv()

cred = credentials.Certificate(os.getenv('ADMIN_SDK'))
default_app = firebase_admin.initialize_app(cred)
db = firestore.client()

# Main Flask App
@app.route("/")
def main():
    check_answer("hi", "chal_1", "test")

    return render_template("index.html", items=[login("hi")])


# Function to login with a display name
# TODO: (maybe) change to Google auth
def login(display_name):
    try:
        display_name = display_name.lower()
        doc_ref = db.collection("users").document(display_name)
        user_data = doc_ref.get()

        # check if user exists
        if user_data.exists:
            print("User Fetched:", display_name)
            print(f"User data: { {"id":doc_ref.id} | user_data.to_dict() }")
            return {"id":doc_ref.id} | user_data.to_dict()

        # create new item in users collection if not there
        # case doesn't matter
        else:
            doc_ref.set({
                "completed": [],
                "score": 0
            })
            print("New User Created:", display_name)
            # login + return data
            user_data = doc_ref.get()
            print(f"User data: { {"id":doc_ref.id} | user_data.to_dict() }")
            return {"id":doc_ref.id} | user_data.to_dict()
    except Exception as e:
        return f"An error occured with logging in: {e}"


# Function to fetch all challenges
@app.route('/api/challenges', methods=['GET'])
def get_all_challenges():
    try:
        print("Fetching all challenges")
        q = ['name', 'category', 'prompt', 'points', 'files', 'hints']
        docs = db.collection("challenges").select(q).stream()
        all_chals = []
        for doc in docs:
            all_chals.append({"id": doc.id} | doc.to_dict())
        return jsonify(all_chals)
    except Exception as e:
            return f"An error occured with fetching challenges: {e}"


# Function to fetch the scoreboard
@app.route('/api/scoreboard', methods=['GET'])
def fetch_scoreboard():
    try:
        print("Fetching scoreboard:")
        docs = db.collection("users").order_by("score").stream()
        all_users = []
        for doc in docs:
            all_users.append({"id": doc.id} | doc.to_dict())
        return jsonify(all_users)
    except Exception as e:
        return f"An error occured with fetching scoreboard: {e}"

# Function to check if the user passed the correct answer
def check_answer(uuid, challenge_id, user_answer):
    try:
        # fetch challenge info only if the user is correct
        q = (
            db.collection('challenges')
            .where(filter=firestore.FieldFilter('answer', '==', user_answer))
            .select(['name', 'points'])
        )
        chal_data = q.stream()
        arr = [{"id":doc.id}|doc.to_dict() for doc in chal_data]
        # print(arr)

        # fetch user information
        user_ref = db.collection("users").document(uuid)
        user_data = user_ref.get().to_dict()

        # we found one exact match
        if len(arr) == 1 and arr[0]["id"]==challenge_id:
            print("Answer was correct!")
            # TODO: award points if not already completed
            if challenge_id not in user_data["completed"]:
                pass
            
            return True

        # any other number
        return False
    except Exception as e:
        return f"An error occured with submitting your answer!: {e}"
import json
import threading
import time

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

cred = credentials.Certificate(json.loads(os.getenv('ADMIN_SDK')))
default_app = firebase_admin.initialize_app(cred)
db = firestore.client()

# Main Flask App
@app.route("/", methods=['GET', 'POST'])
def main():
    # check_answer("hi", "chal_1", "test")
    # Create an Event for notifying main thread.
    # callback_done = threading.Event()

    # # Create a callback on_snapshot function to capture changes
    # def snapshot(doc_snapshot, changes, read_time):
    #     print("Callback received query snapshot, fetching live scoreboard.")
    #     all_users = []
    #     for doc in doc_snapshot:
    #         # print("SNAPSHOT")
    #         # print(f"{doc.to_dict()}")
    #         all_users.append({"id": doc.id} | doc.to_dict())
    #     callback_done.set()
    #     print(all_users)
    #     return all_users

    # col_query = db.collection("users")

    # Watch the collection query
    # query_watch = col_query.on_snapshot(snapshot)
    return render_template("index.html", items=fetch_scoreboard().json)


# Function to login with a display name
# TODO: (maybe) change to Google auth
# the reason why this was not google auth in the first place is bc minis can be done solo or in groups - depending on attendance of event
# just makes more sense if we can have one 'user' that submits for the entire team
# (and also makes it easier to test without having to log in)
# could be something we integrate to allow for multiple google accs to be added to a 'team' but that feels unnecessary for minis
@app.route("/api/user", methods=['GET', 'POST'])
def login():
    data = request.get_json()
    # print("RECEIVED DATA FROM FRONTEND")
    # print(data)

    try:
        data['display_name'] = data['display_name'].lower()
        doc_ref = db.collection("users").document(data['display_name'])
        user_data = doc_ref.get()

        # check if user exists
        if user_data.exists:
            print("User Fetched:", data['display_name'])
            print(f"User data: { {"id":doc_ref.id} | user_data.to_dict() }")
            return {"id":doc_ref.id} | user_data.to_dict()

        # create new item in users collection if not there
        # case doesn't matter
        else:
            doc_ref.set({
                "completed": [],
                "score": 0
            })
            print("New User Created:", data['display_name'])
            # login + return data
            user_data = doc_ref.get()
            print(f"User data: { {"id":doc_ref.id} | user_data.to_dict() }")
            return jsonify({"id":doc_ref.id} | user_data.to_dict())
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
# TODO: change to live update, 
@app.route('/api/scoreboard', methods=['GET'])
def fetch_scoreboard():
    try:
        print("Fetching scoreboard")
        docs = db.collection("users").order_by("score", direction=firestore.Query.DESCENDING).stream()
        all_users = []
        for doc in docs:
            all_users.append({"id": doc.id} | doc.to_dict())
        return jsonify(all_users)
    except Exception as e:
        return f"An error occured with fetching scoreboard: {e}"

# Function to check if the user passed the correct answer
@app.route('/api/answer', methods=['POST'])
def check_answer():
    # expect json payload from frontend containing the info
        # uuid, challenge_id, user_answer
    data = request.get_json()
    # print("RECEIVED DATA FROM FRONTEND")
    # print(data)

    try:
        # fetch challenge info only if the user is correct
        q = (
            db.collection('challenges')
            .where(filter=firestore.FieldFilter('answer', '==', data['user_answer']))
            .select(['name', 'points'])
        )
        chal_data_stream = q.stream()
        chal = [{"id":doc.id}|doc.to_dict() for doc in chal_data_stream]
        # print(arr)

        # fetch user information
        user_ref = db.collection("users").document(data['uuid'])
        user_data = user_ref.get().to_dict()
        # print("USER DATA: ", user_data)

        # we found one exact match
        if len(chal) == 1 and chal[0]["id"]==data['challenge_id']:
            print("Answer was correct!")
            if data['challenge_id'] not in user_data["completed"]:
                user_ref.update({"score": user_data["score"] + chal[0]["points"]})
                user_ref.update({"completed": firestore.ArrayUnion([data['challenge_id']])})
            return jsonify({"correct":"success"})

        # any other number
        return jsonify({"correct":"fail"})
    except Exception as e:
        return f"An error occured with submitting your answer!: {e}"


if __name__ == "__main__":
    main()
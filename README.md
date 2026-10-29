# Hack-o-Ween-2026
A Mini-CTF for Halloween 2026 @ UIC! Hosted by WiCyS x LUG


### Running Locally:

0. Install VSCode, Python + pip, and NodeJS + npm
1. Clone or fork this repo
2. Run the following commands in terminal
3. Backend Setup
    * `cd backend` to change directories to backend
    * `python -m venv env` to create a new virtual environment 
    * Activate the virtual environment
        * For Windows : `.\env\Scripts\activate`
        * For Mac : `source env/bin/activate`
    * You will now see a `(venv)` infront of your command line
    *  `pip install -r requirements.txt` to install dependencies for Python + Flask program
    * `set FLASK_APP=main.py` to set the flask app
    * `flask --app main.py --debug run` to run the flask backend in debug mode
        * You may also use `python main.py` run the backend without debug mode
    * Your flask server will now be running on `localhost:PORT`! You can look at the terminal for the port number
    * Note: The port may load a page that says `Not Found     The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again.`
    * Make sure the URLs and other deployment-dependent lines are changed to the local versions of those URLs as well (read `backend/README.md`)

4. Frontend Setup
    * In a new terminal window (using the `+` button on top right of the terminal)
    * `cd frontend` to change directories to frontend
    * `npm install` to install dependencies for React + Vite frontend
    * `npm run dev` run the frontend
    * Your React app is now running on `localhost:PORT`! You can follow the link from the terminal for the port number.

5. Note: There may be issues running this program in other Python environments, especially on **MacOS**, such as Anaconda, Homebrew, or Jupyter. 
    * If you are getting an error `no module named flask_cors`, reactivate your environment while in env by running `source env/bin/activate`

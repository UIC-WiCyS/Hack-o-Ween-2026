# Deployment

### Vercel Project
0. Create a new project on Vercel and import the repo. 
1. Make sure the root directory is set to the absolute root. The 'Application Preset' should be 'Services.'
    * Make sure the application preset for the `backend` is Flask.
    * Make sure the application preset for the `frontend` is Vite.
2. Input the environment variable for the Firebase API as `ADMIN_SDK`.
    * Using the Firebase generated`...-adminsdk.json`, paste it as a string in the value box

### Repository Setup
0. To deploy to Vercel, make sure everything is updated and pushed to `main`. 
1. Use `json.loads` for the environment variable used for `credentials.Certificate` in `main.py`
2. Change any `localhost:{PORT}` URL fetches to `window.location.origin` 
3. Change any redirects needed in `frontend/vercel.json` for any files with no file extension

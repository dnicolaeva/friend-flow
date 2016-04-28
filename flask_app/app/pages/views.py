from app.app_and_db import app
from datetime import datetime
from flask import jsonify, render_template, redirect, url_for, request
from werkzeug import secure_filename
import requests
import dataloader
import json
 
# These are the extension that we are accepting to be uploaded
app.config['ALLOWED_EXTENSIONS'] = set(['htm', 'html'])

# Global variables
message_file = None 
processed_json = {}

# For a given file, return whether it's an allowed type or not
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in app.config['ALLOWED_EXTENSIONS']

@app.route('/')
def index():
  return render_template('pages/default.html')

# Route that will process the file upload
@app.route('/upload', methods=['POST'])
def upload():
  file = request.files['file']
  
  if not file:
    print "No file found"
    return redirect(url_for('index'))

  if not allowed_file(file.filename):
    print "Invalid file type"
    return redirect(url_for('index'))

  processed_json = dataloader.load_friendship_json(file)
  valid_file = dataloader.validify(file)
  
  if not valid_file:
    print "Invalid file schema"
    return redirect(url_for('index'))
  
  global processed_json
  processed_json = dataloader.load_friendship_json(file)
  return render_template('pages/graph.html')
  
@app.route('/processed-json/', methods=['GET'])
def echo():
    global processed_json
    return processed_json
 
@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

@app.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, nothing at this URL.', 404

@app.teardown_appcontext
def shutdown_session(exception=None):
  # db.remove()
  return


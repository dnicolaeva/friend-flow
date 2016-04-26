from app.app_and_db import app
from datetime import datetime
from flask import jsonify, render_template, redirect, url_for

import requests
 
@app.route('/')
def index():
  return render_template('pages/home_page.html')

@app.route('/api/getnoun/<string:input_phrase>/')
def get_noun(input_phrase):
  print(input_phrase)
  api_response = 'hello'
  return api_response


@app.route('/api/getnoun')
def cities():
  whoa = "whoa"
  print whoa
  return str(whoa)

@app.teardown_appcontext
def shutdown_session(exception=None):
  db.remove()
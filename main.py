#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
from google.appengine.api import users
import json
import os
import random

from google.appengine.ext import ndb
import jinja2
import webapp2

from models import TttStats


jinja_env = jinja2.Environment(
  loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
  autoescape=True)

tttstats = TttStats( wins = 0, 
                      losses =0, 
                      ties =0 )

ttt_key = tttstats.put();


class MainPage(webapp2.RequestHandler):
    def get(self):
        user_email = users.get_current_user().email().lower()
        if not (user_email == "fisherds@gmail.com" or user_email == "tedsamore@gmail.com"):
            self.response.out.write("For grading reasons, this app is locked down! Come back again in a few days")
        else:
            ttt = ttt_key.get()
            template = jinja_env.get_template("templates/ttt.html")
            self.response.out.write(template.render({"TttStats": tttstats}))


class ResetStatsAction(webapp2.RequestHandler):
  def post(self):
    tttstats.wins = 0
    tttstats.losses = 0 
    tttstats.ties = 0
    tttstats.put()
    self.response.headers["Content-Type"] = "application/json"
    response = {"wins": tttstats.wins, "losses": tttstats.losses, "ties": tttstats.ties}
    self.response.out.write(json.dumps(response))

class GameCompleteAction(webapp2.RequestHandler):
  def post(self):
    if self.request.get("result")   == "win":
        tttstats.wins = tttstats.wins + 1
    elif self.request.get("result") == "loss":
        tttstats.losses = tttstats.losses + 1
    else: 
        tttstats.ties = tttstats.ties + 1 
    tttstats.put()
    self.response.headers["Content-Type"] = "application/json"
    response = {"wins": tttstats.wins, "losses": tttstats.losses, "ties": tttstats.ties}
    self.response.out.write(json.dumps(response))


def get_move_for_game(game_string):
  """  Returns the index for the computer players move given a 9 character game string. """
  open_square_occurrences = [i for i, letter in enumerate(game_string) if letter == "-"]
  return random.choice(open_square_occurrences)


class GetMove(webapp2.RequestHandler):
  def get(self):
    game_string = self.request.get("gamestring")
    move = get_move_for_game( game_string )
    self.response.headers["Content-Type"] = "application/json"
    response = { "computer_move": move }
    self.response.out.write(json.dumps(response))

app = webapp2.WSGIApplication([
    ("/", MainPage),
    ("/resetstats", ResetStatsAction),
    ("/gamecomplete", GameCompleteAction),
    ("/getmove", GetMove),
], debug=True)

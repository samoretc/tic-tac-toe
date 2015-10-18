from google.appengine.ext import ndb

class TttStats(ndb.Model):
    wins = ndb.IntegerProperty()
    losses = ndb.IntegerProperty()
    ties = ndb.IntegerProperty()

    
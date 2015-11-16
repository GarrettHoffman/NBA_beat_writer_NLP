import requests
from requests_oauthlib import OAuth1
import cnfg
import json
import pymongo

config = cnfg.load(".twitter_config")

oauth = OAuth1(config["consumer_key"],
               config["consumer_secret"],
               config["access_token"],
               config["access_token_secret"])

celtics = ['SteveBHoop',
           'BillDoyle15',
           'Murf56',
           'Scott_Souza',
           'ByJayKing',
           'ESPNForsberg',
           'SherrodbCSN',
           'Marc_DAmico',
           'CelticsHub']

for writer in celtics:

    parameters = {"screen_name": writer,
                  "exclude_replies": True, 
                  "include_rts": False,
                  "count": 200}
    response = requests.get("https://api.twitter.com/1.1/statuses/user_timeline.json",
                            params = parameters,
                            auth=oauth)
    tweets = response.json()

    results = []
    for tweet in tweets:
        results.append(tweet)

    client = pymongo.MongoClient()
    db = client.nbabeatwritertweets
    collection = db.celtics

    for tweet in results:
        data={}
        data["id"] = tweet['id']  
        data["reporter"] = tweet['user']['name']
        data["text"] =  tweet['text'].encode('utf-8')
        data["datetime"] = tweet['created_at']
        data["favorites"] = tweet['favorite_count']
        data["retweets"] = tweet['retweet_count']
        collection.replace_one(data, data, True)
        db.collection.create_index([("id" , pymongo.ASCENDING), ("unique" , True)])

knicks = ['Al_Iannazzone',
          'StevePopper',
          'NYPost_Berman',
          'FisolaNYDN',
          'ScottCacciola',
          'IanBegley']

for writer in knicks:

    parameters = {"screen_name": writer,
                  "exclude_replies": True, 
                  "include_rts": False,
                  "count": 200}
    response = requests.get("https://api.twitter.com/1.1/statuses/user_timeline.json",
                            params = parameters,
                            auth=oauth)
    tweets = response.json()

    results = []
    for tweet in tweets:
        results.append(tweet)

    client = pymongo.MongoClient()
    db = client.nbabeatwritertweets
    collection = db.knicks

    for tweet in results:
        data={}
        data["id"] = tweet['id']  
        data["reporter"] = tweet['user']['name']
        data["text"] =  tweet['text'].encode('utf-8')
        data["datetime"] = tweet['created_at']
        data["favorites"] = tweet['favorite_count']
        data["retweets"] = tweet['retweet_count']
        collection.replace_one(data, data, True)
        db.collection.create_index([("id" , pymongo.ASCENDING), ("unique" , True)])

lakers = ['Mike_Bresnahan',
          'MarkG_Medina',
          'KevinDing',
          'janiscarr',
          'SerenaWinters',
          'LakersReporter',
          'billoram',
          'EricPincus',
          'BaxterHolmes']

for writer in lakers:

    parameters = {"screen_name": writer,
                  "exclude_replies": True, 
                  "include_rts": False,
                  "count": 200}
    response = requests.get("https://api.twitter.com/1.1/statuses/user_timeline.json",
                            params = parameters,
                            auth=oauth)
    tweets = response.json()

    results = []
    for tweet in tweets:
        results.append(tweet)

    client = pymongo.MongoClient()
    db = client.nbabeatwritertweets
    collection = db.lakers

    for tweet in results:
        data={}
        data["id"] = tweet['id']  
        data["reporter"] = tweet['user']['name']
        data["text"] =  tweet['text'].encode('utf-8')
        data["datetime"] = tweet['created_at']
        data["favorites"] = tweet['favorite_count']
        data["retweets"] = tweet['retweet_count']
        collection.replace_one(data, data, True)
        collection.create_index([("id" , pymongo.ASCENDING), ("unique" , True)])

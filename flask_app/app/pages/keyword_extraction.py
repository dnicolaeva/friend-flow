from alchemyapi import AlchemyAPI
import json
import sys

def return_sentiments(all_messages):
    sentiments = {}
    print "Hey everybody!!!"
    print all_messages
    for recipient in all_messages:
        print recipient

        text = all_messages[recipient]
        sentiments[recipient] = get_keywords(text)
    return sentiments
            

def get_keywords(text):
    score = 0
    count = 0
    alchemyapi = AlchemyAPI()
    response = alchemyapi.keywords('text', text, {'sentiment': 1})
    if response['status'] == 'OK':
        for keyword in response['keywords']:
            if 'score' in keyword['sentiment']:
                count = count + 1
                score = score + float(keyword['sentiment']['score'])
    else:
        print('Error in keyword extaction call: ', response['statusInfo'])
    return score / count


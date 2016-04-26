
# coding: utf-8

# In[48]:

from alchemyapi import AlchemyAPI
import json
import sys

def return_sentiments(d, week):
    sentiments = {}
    messages_dict = d[week]
    for recipient in messages_dict:
        text = messages_dict[recipient]
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


# In[ ]:




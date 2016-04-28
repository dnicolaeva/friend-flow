import fb_messages
import message_analyser
import datetime
import random

def getJSON(soup):
    week = create_week_array(soup)
    return tie_strengths(week)

def tie_strengths(msg_array):
    stats_array = message_analyser.message_stats(msg_array)
    names = []
    results = []
    culledresults = []
    weeknum = 0
    #print stats_array
    for week in stats_array:
        currdict = {}
        values = []
        #print 'week is'
        #print week
        for name in week:
            #print 'names is'
            #print names
            prev_strength = 0;
            if name in names:
                prev_strength = results[weeknum-1][name][1]
            else:
                names.append(name)
            curr_stats = week[name]
            #print 'hi im here'
            #print name
            #print curr_stats
            tie = score(curr_stats)
            values.append(tie)
            #[id, tiestrength, tiederiv]
            print 'printing stuff here'
            print curr_stats
            print tie
            print prev_strength
            currdict[name] = [curr_stats[0], tie, tie - prev_strength]
            print 'hi now here'
        values.sort(reverse=True)
        maxppl = 11 if len(values) > 12 else len(values)-1
        results.append(currdict)
        culleddict = {}
        for name in currdict:
            if currdict[name][1] > values[maxppl]:
                culleddict[name] = currdict[name]
        culledresults.append(culleddict)
        weeknum+=1
    jsonarray = jsonify(results)
    return jsonarray


#stats = [id, first message date, last message date, num messages, sentiment score]
#tie strength is 0-1
def score(stats):
    return random.random()

def jsonify(stats_array):
    stringarray = []
    for week_dict in stats_array:
        weekarr = []
        for name in week_dict:
            json_string = getstringfromstats(name, week_dict[name])
            weekarr.append(json_string)
        stringarray.append(weekarr)
       
def getstringfromstats(name, stats_array):
    return '{ "tieStrength": ' + str(stats_array[1]) + ', "tieStrengthDerivative": ' + str(stats_array[2]) + ', "name": ' + name + ', "id": ' + str(stats_array[0]) + '}'


def find_index_in_weeks(time, min_time):
    delta = time - min_time
    delta = delta.days
    index = delta / 7
    return index

def create_week_array(soup):
    print 'Loading messages...'
    name_to_thread, name_to_sharing, min_time = fb_messages.load_messages(soup)

    print min_time

    max_time = datetime.date.today()

    delta = max_time - min_time
    delta = delta.days
    delta = delta / 7
    rem = delta % 7
    max_time = max_time + datetime.timedelta(days = 7 - rem)

    if rem == 0:
        arr_length = delta 
    else:
        arr_length = delta + 1

    weeks = []
    for i in range (0, arr_length):
        hashmap = {}
        weeks.append(hashmap)

    print 'Loading weeks array...'
    for recipient, curr_FB_thread in name_to_thread.iteritems():
        messages = curr_FB_thread.messages

        for msg in messages:
            time = msg.date

            index = find_index_in_weeks(time, min_time)
            hashmap = weeks[index]
            if recipient in hashmap:
                arr = hashmap[recipient]
                arr.append(msg)
                hashmap[recipient] = arr
            else:
                hashmap[recipient] = [msg]

    return weeks


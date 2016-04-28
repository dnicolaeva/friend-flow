import fb_messages
import message_analyser
import datetime
import random

def getJSON(soup):
    week = create_week_array(soup)
    print "GOT WEEKS!"
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
        for name in week:
            prev_strength = 0;
            if name in names:
                prev_strength = results[weeknum-1][name][1]
            else:
                names.append(name)
            curr_stats = week[name]
            tie = score(curr_stats, name)
            deriv = (tie - prev_strength + 1) / 2
            values.append(tie)
            currdict[name] = [curr_stats[0], tie, deriv]
        values.sort(reverse=True)
        maxppl = 11 
        if len(values) < 12:
            maxppl = len(values)-1
        results.append(currdict)
        culleddict = {}
        for name in currdict:
            if currdict[name][1] > values[maxppl]:
                culleddict[name] = currdict[name]
        print len(culleddict)
        if len(culleddict) == 11:
            culledresults.append(culleddict)
        weeknum+=1
    jsonarray = jsonify(culledresults)
    print jsonarray
    return jsonarray

#stats = [id, first message date, last message date, num messages, sentiment score]
#tie strength is 0-1
def score(stats, name):
    first = diff_month(stats[6], stats[1]) * (.2/12)
    if first > 1:
        first = 1
    last = 1 - ((stats[6] - stats[2]).days * .01)
    if last < 0:
        last = 0
    number = (stats[3] / ((stats[2] - stats[1]).days + 1)) * .05
    if number > 1:
        number = 1
    sentiment = (stats[4] + 1) / 2
    prev = .02 * stats[5]
    if prev > 1:
        prev = 1
    score = (.05 * first) + (.25 * last) + (.25 * number) + (.1 * sentiment) + (.35 * prev)
    #return random.random()
    #print "scoring", name
    #print stats
    #print first, last, number, sentiment
    #print score
    return score

def diff_month(d1, d2):
    return (d1.year - d2.year)*12 + d1.month - d2.month

def jsonify(stats_array):
    stringarray = '['
    for week_dict in stats_array:
        weekarr = '['
        for name in week_dict:
            json_string = getstringfromstats(name, week_dict[name])
            weekarr = weekarr + json_string + ', '
        if len(weekarr) < 2:
            weekarr = ''
        else:
            weekarr = weekarr[:-2] + ']'
        if weekarr != '':
            stringarray = stringarray + weekarr + ', '
    stringarray = stringarray[:-2] + ']'
    return stringarray
       
def getstringfromstats(name, stats_array):
    return '{ "tieStrength": ' + str(stats_array[1]) + ', "tieStrengthDerivative": ' + str(stats_array[2]) + ', "name": "' + name + '", "id": ' + str(stats_array[0]) + '}'


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


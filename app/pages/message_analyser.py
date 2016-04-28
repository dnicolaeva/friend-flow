import keyword_extraction
import datetime
from copy import deepcopy

def message_stats(week_array):
    results = []
    runningdict = {}
    id_counter = 0
    weeknum = 1
    #print "week_array"
    #print week_array
    weekof = datetime.date(1982,1,1)
    for week in week_array:
        #print "Week:"
        #print week
        sentiments = keyword_extraction.return_sentiments(week)
        for name in week:
            msgs = week[name]
            firstdate = datetime.date(3000,1,1)
            lastdate = datetime.date(1980,1,1)
            for msg in msgs:
                if msg.date < firstdate:
                    firstdate = msg.date
                if msg.date > lastdate:
                    lastdate = msg.date
            if lastdate > weekof:
                weekof = lastdate

            if name not in runningdict:
                runningdict[name] = [id_counter, firstdate, lastdate, len(msgs), sentiments[name], len(msgs), lastdate]
                id_counter+=1
            else:
                runningdict[name][2] = lastdate
                runningdict[name][3] += len(msgs)
                sentiment = runningdict[name][4] * (weeknum -1)
                sentiment = float(sentiment + sentiments[name]) / weeknum
                runningdict[name][4] = sentiment
                runningdict[name][5] = len(msgs)
        weeknum+=1
        for name in runningdict:
            runningdict[name][6] = weekof
        results.append(deepcopy(runningdict))
    return results



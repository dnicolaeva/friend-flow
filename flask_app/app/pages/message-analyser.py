import keyword_extraction

def message_stats(week_array):
    results = []
    runningdict = {}
    id_counter = 0
    weeknum = 1
    for week in week_array:
        sentiments = keyword_extraction.return_sentiments(week)
        for name in week:
            msgs = week[name]
            if name not in runningdict:
                runningdict[name] = [id_counter, msgs[0].date, msgs[len(msgs)-1].date, len(msgs), sentiments[name]]
                id_counter+=1
            else:
                runningdict[name][2] = msgs[len(msgs)-1].date
                runningdict[name][3] += len(msgs)
                sentiment = runningdict[name][4] * (weeknum -1)
                sentiment = float(sentiment + sentiments[name]) / weeknum
                runningdict[name][4] = sentiment
        weeknum+=1
        results.append(runningdict)       
    return results


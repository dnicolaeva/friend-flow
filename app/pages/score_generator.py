import message_analyser

def tie_strengths(msg_array):
    stats_array = message_analyser.message_stats(msg_array)
    names = []
    results = []
    weeknum = 0
    for week in stats_array:
        currdict = {}
        values = []
        for name in week:
            prev_strength = 0;
            if name in names:
                prev_strength = results[weeknum-1][name]
            else:
                names.append(name)
            curr_stats = week[name]
            tie = score(curr_stats)
            values.append(tie)
            #[id, tiestrength, tiederiv]
            currdict[name] = [curr_stats[0], tie, tie - prev_strength]
        values.sort(reverse=True)
        maxppl = 11 if len(values) > 12 else len(values)-1
        culleddict = {}
        for name in currdict:
            if currdict[name][1] > values[maxppl]:
                culleddict[name] = currdict[name]
        results.append(culleddict)
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
    return '{ "tieStrength": ' + stats_array[1] + ', "tieStrengthDerivative": ' + stats_array[2] + ', "name": ' + name + ', "id": ' + stats_array[0] + '}'

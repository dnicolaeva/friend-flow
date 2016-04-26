import fb_messages
import datetime

def find_index_in_weeks(time, min_time):
	delta = time - min_time
	delta = delta.days
	index = delta / 7
	return index

print 'Loading messages...'
name_to_thread, name_to_sharing, min_time = fb_messages.load_messages('../facebook-dnicolaeva/html/messages.htm')

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

print weeks


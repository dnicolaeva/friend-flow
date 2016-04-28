from bs4 import BeautifulSoup
import re
import datetime

class FBThread:
	def __init__(self, recipient, messages):
		self.recipient = recipient
		self.messages = messages

	def __repr__(self):
		ret = 'Messages with: ' + self.recipient + '\n\n' 
		for message in self.messages:
			ret = ret + str(message) + '\n'
		return ret

	def __str__(self):
		ret = 'Messages with: ' + self.recipient + '\n\n' 
		for message in self.messages:
			ret = ret + str(message) + '\n'
		return ret

class FBMessage:
	def __init__(self, text, date, is_from_me):
		self.text = text
		self.date = date
		self.is_from_me = is_from_me

	def __repr__(self):
		if self.is_from_me == True:
			return 'You: ' + self.text  + '\n'
		return 'Them: ' + self.text  + '\n'

	def __str__(self):
		if self.is_from_me == True:
			return 'You: ' + self.text  + '\n'
		return 'Them: ' + self.text  + '\n'

def load_messages(soup):
	name_to_sharing = {}
	name_to_thread = {}
	min_date = None

	me = soup.find('h1').get_text()
	me = me.encode('ascii', 'ignore')
	me = me.strip(' ')
	conversation_threads = soup.find_all('div', class_='thread')

	for conversation in conversation_threads:
		participants = conversation.contents[0]
		participants = participants.encode('ascii', 'ignore')
		participants = participants.split(',')

		# If its a group conversation get the number of groups you share
		if len(participants) > 2:
			name_to_sharing = update_name_to_sharing(participants, name_to_sharing)
		
		# For individual messages, record them in data structure
		else:
			recipient = find_receipient(participants, me)
			recipient = recipient.encode('ascii', 'ignore')
			recipient = recipient.strip(' ')
			curr_thread, curr_date = create_thread(conversation, recipient, me)
			
			if recipient in name_to_thread:
				print "ERROR"
			else:
				name_to_thread[recipient] = curr_thread

			if min_date == None or min_date > curr_date:
				min_date = curr_date

	return (name_to_thread, name_to_sharing, min_date)

def create_thread(conversation, recipient, me):
	messages = []
	min_date = None

	message_headers = conversation.find_all('div', class_='message')
	message_texts = conversation.find_all('p')
	
	for i in range(0, len(message_headers) ):
		curr_message, curr_date = create_message (message_headers, message_texts, i, me)
		messages.append(curr_message)

		if min_date == None or min_date > curr_date:
			min_date = curr_date

	# returning time here for the sake of efficiency and not having to preprocess all the data again
	return ( FBThread(recipient, messages), min_date )

def create_message(message_headers, message_texts, i, me):
	test_time = datetime.date(2011, 8, 17)

	person = message_headers[i].find('span', class_='user').get_text()
	person = person.encode('ascii', 'ignore')
	person = person.strip(' ')
	
	is_from_me = update_is_from_me(person, me)
	
	date = message_headers[i].find('span', class_='meta').get_text()
	date = date.encode('ascii', 'ignore')
	date = format_date(date)

	text = message_texts[i].get_text()
	text = text.encode('ascii', 'ignore')

	# returning time here for the sake of efficiency and not having to preprocess all the data again
	return ( FBMessage(text, date, is_from_me) , date )

def update_name_to_sharing(participants, mapping):
	for person in participants:
				if person in mapping:
					mapping[person] = mapping[person] + 1
				else:
					mapping[person] = 1
	return mapping
			
def find_receipient(participants, me):
	if len(participants) != 2:
		print 'ERROR. Not enough participants in conversation'
		return None
	for participant in participants:
		if participant != me:
			return participant.strip()

def update_is_from_me(person, me):
	if person == me:
		return True
	return False

def format_date(string):
	#Input format Tuesday, September 4, 2012 at 2:56pm CDT
	string = string.split(',')
	monthday = string[1].split()
	yeartime = string[2].split()
	
	month = monthday[0]
	month = month_to_num(month)
	day = int(monthday[1])
	year = int(yeartime[0])

	return datetime.date(year, month, day)

def month_to_num(month):
	if month == 'January':
		return 1
	if month == 'February':
		return 2
	if month == 'March':
		return 3
	if month == 'April':
		return 4
	if month == 'May':
		return 5
	if month == 'June':
		return 6
	if month == 'July':
		return 7
	if month == 'August':
		return 8
	if month == 'September':
		return 9
	if month == 'October':
		return 10
	if month == 'November':
		return 11
	if month == 'December':
		return 12


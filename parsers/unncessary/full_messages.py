import imessage_ab
import fb_ab

class Thread:
	def __init__(self, recipient, messages):
		self.name = name
		self.number = number
		self.id = id
		self.messages = messages

	def __repr__(self):
		ret = 'Messages with: ' + self.name + '\n\n' 
		for message in self.messages:
			ret = ret + message + '\n'
		return ret

class Message:
	def __init__(self, text, date, is_from_me):
		self.text = text
		self.date = date
		self.is_from_me = is_from_me

	def __repr__(self):
		if self.is_from_me == True:
			return 'You: ' + self.text  + '\n'
		return 'Them: ' + self.text  + '\n'

def load_messages(FB_path, full_addressbook):
	print 'Loading FB messages...'
	FB_threads, FB_shared_groups = fb_ab.load_messages(FB_path)
	
	# print 'Loading iMessages...'
	for recipient, curr_FB_thread in FB_threads.iteritems():
		name = recipient
		ID = None
		if name in full_addressbook.name_to_id:
			ID = full_addressbook.name_to_id[name]
			print ID	
		else:
			print "Can't find messages with: " + name 	
		#curr_imessage_thread = imessage_ab.get_messages_for_recipient(ID)
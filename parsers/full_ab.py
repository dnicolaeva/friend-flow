import imessage_ab
import fb_ab

class FullAddressBook:
	def __init__(self, name_to_number, number_to_name, id_to_name, name_to_id):
		self.name_to_number = name_to_number
		self.number_to_name = number_to_name
		self.id_to_name = id_to_name
		self.name_to_id = name_to_id
	
	def __repr__(self):
		ret = ''
		for name in self.name_to_number:
			ret = ret + 'Name:' + name + '\n'
			ret = ret + 'ID: ' + str(self.name_to_id[name]) + '\n'
			ret = ret + 'Number: ' + str(self.name_to_number[name]) + '\n\n'
		return ret

	def find_name(self, number):
		if number not in self.number_to_name:
			return None
		return self.number_to_name[number]

	def find_number(self, name):
		if name not in self.name_to_number:
			return None
		return self.name_to_number[name]

def load_address_book(FB_path):
	FB_addressbook = fb_ab.load_address_book(FB_path)
	imessage_addressbook = imessage_ab.get_all_recipients()

	return w_load_address_book(FB_addressbook, imessage_addressbook)

# Internal function used by load_address_book
def w_load_address_book(FB_addressbook, imessage_addressbook):
	name_to_number = {}
	number_to_name = {}
	id_to_name = {}
	name_to_id = {}

	# Traverse over imessage address book as these are the only ones with messages 
	# (and thus the only ones we care about)
	for receipient in imessage_addressbook:
		imessage_number = receipient.phone_or_email
		matching_fb_number = None
		
		for number in FB_addressbook.number_to_name:
			if imessage_number in number or number in imessage_number:
				matching_fb_number = number
		
		if matching_fb_number is not None:
			# We care about the number stored in iMessages, and map it to the FB name
			# Thus there is no worry about losing the FB number
			name = FB_addressbook.find_name(matching_fb_number)
			number = imessage_number
			ID = receipient.id
			
			name_to_number[name] = number
			number_to_name[number] = name
			id_to_name[ID] = name
			name_to_id[name] = ID
		# else:
		# 	print 'Can\'t find pair to: ' + imessage_number + '\n'

	return FullAddressBook(name_to_number, number_to_name, id_to_name, name_to_id)
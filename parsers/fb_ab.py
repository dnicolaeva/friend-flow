from bs4 import BeautifulSoup
import re

class FBAddressBook:
	def __init__(self, name_to_number, number_to_name):
		self.name_to_number = name_to_number
		self.number_to_name = number_to_name
	
	def __repr__(self):
		ret = ''
		for name in self.name_to_number:
			ret = ret + 'Name:' + name + '\nNumber: ' + self.name_to_number[name] + '\n\n'
		return ret

	def find_name(self, number):
		if number not in self.number_to_name:
			return None
		return self.number_to_name[number]

	def find_number(self, name):
		if name not in self.name_to_number:
			return None
		return self.name_to_number[name]

def load_address_book(path):
	# path = 'facebook-dnicolaeva/html/contact_info.htm'
	fd = open(path, 'r')

	soup = BeautifulSoup(fd, 'html.parser')
	address_table = soup.find_all('table')[1]
	address_contacts = address_table.find_all('tr')

	number_to_name = {}
	name_to_number = {}

	for row in address_contacts:
		columns = row.find_all('td')
		if len(columns) > 0:
			name = columns[0].get_text()
			phone = None
			
			for item in columns[1].find_all('li'):
				text = item.get_text()
				if "contact" in text and "@" not in text:
					phone = re.sub('[^0-9]','', text)

			if phone is not None:
				name = name.encode('ascii', 'ignore')
				phone = phone.encode('ascii', 'ignore')
				name_to_number[name] = "+" + phone
				number_to_name[phone] = name

	return FBAddressBook(name_to_number, number_to_name)
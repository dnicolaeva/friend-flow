import full_ab

full_addressbook = full_ab.load_address_book('../facebook-dnicolaeva/html/contact_info.htm')

print(full_addressbook)

# for ID in full_addressbook.id_to_name:
# 	print (full_ab.imessage_ab.get_messages_for_recipient(ID))
# 	print '---------------------------'

print(full_ab.imessage_ab.get_messages_for_recipient(1))


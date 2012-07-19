openstack-birthday2012
======================

Openstack birthday contest 2012

A contest where one needs to think of the hardest way to output "Happy Birthday OpenStack" as plain text, and provide the source code on /src.

This app uses mongo and rabbitmq as services. It first uses node.io to parse the contest page to the phrase above, then stores the phrase in mongo which returns an id which is then sent to a rabbitmq queue. The subscriber then listens to the message, takes the id and looks it up in mongo to retrieve the phrase, and then display the text.

Libraries used:

Express
Node.io
ampq
mongo


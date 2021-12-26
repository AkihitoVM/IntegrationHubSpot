# Integrations project

Create node.js app that synchronizes contacts and tickets from Hubspot to MySQL/MariaDB database.

Use **sequelize** npm package for database communication.

[https://www.npmjs.com/package/sequelize](https://www.npmjs.com/package/sequelize)

This synchronization process will run periodically in 10 min intervals. Optimize this process for synchronization of large amounts of contacts/tickets. You can use any project structure you want. Create at least two tables in DB: contacts and tickets (you can create additional tables if you need them) DB schema is up to you.

<h2>Contact sync</h2>

[https://legacydocs.hubspot.com/docs/methods/contacts/contacts-overview](https://legacydocs.hubspot.com/docs/methods/contacts/contacts-overview)

<p style="text-decoration: underline;">Contact fields to sync from Hubspot:</p>

vid 
firstname 
lastname 
createdate

<h2>Ticket sync</h2>

[https://legacydocs.hubspot.com/docs/methods/tickets/tickets-overview](https://legacydocs.hubspot.com/docs/methods/tickets/tickets-overview)

<p style="text-decoration: underline;">Ticket fields to sync from Hubspot:</p>

id
content

## Requirements

For development, you will only need Node.js and a node global package, Yarn, installed in your environement.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm


###
### Yarn installation
  After installing node, this project will need yarn too, so just run the following command.

      $ npm install -g yarn

---

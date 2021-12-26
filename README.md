<p style="text-align: center;font-weight: bold;
font-size:25px;">Integrations project</p>

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
const db = require("./models");
const utils = require("./utils")
db.sequelize.sync();
const Contact = db.contacts;
const Ticket = db.tickets;
let timestamp = null
let objectId = null
let baseUrl = `https://api.hubapi.com/crm-objects/v1/change-log/tickets`
const timeOutSyncContacts = async (contacts) => {
    const contactIdsFromDb = await Contact.findAll({
        attributes: ['vid']
    })
    const ids = []
    for (const obj of contactIdsFromDb) {
        ids.push(obj.dataValues.vid)
    }
    for (const contact of contacts) {
        let contactFromDB = await Contact.findAll({
            where: {
                vid: contact.vid
            }
        })
        if (contactFromDB.length !== 0) {
            if (!utils.sameContact(contact, contactFromDB[0])) {
                Contact.update({ firstname: contact.firstname, lastname: contact.lastname }, {
                    where: {
                        vid: contact.vid
                    }
                })
            }
        } else {
            const NewContact = {
                vid: contact.vid,
                firstname: contact.firstname,
                lastname: contact.lastname,
                createdate: contact.createdate
            }
            Contact.create(NewContact)
                .catch(err => {
                    console.log({
                        message:
                            err.message || "Some error occurred while creating the Contact."
                    });
                });
        }
        for (let i = 0; i < ids.length; i++) {
            if (ids[i].toString() === contact.vid.toString()) {
                ids.splice(i, 1)
            }
        }
    }
    ids.forEach(id => {
        Contact.findAll({
            where: {
                vid: Number(id)
            }
        })
            .then(contact => {
                contact[0].destroy()
            })
    })
}

const syncContacts = async () => {
    const contacts = await utils.getAllContacts()
    timeOutSyncContacts(contacts)
    const RecentlyCreatedcontacts = await utils.getRecentlyCreatedContacts()
    timeOutSyncContacts(RecentlyCreatedcontacts)
    setTimeout(async () => {
        const RecentlyCreatedcontacts = await utils.getRecentlyCreatedContacts()
        timeOutSyncContacts(RecentlyCreatedcontacts)
    }, 10 * 60 * 1000);
}

const timeoutSyncTickets = async () => {
    let a = await utils.getLogOfChangesForTickets(timestamp, objectId, baseUrl)
    if (a[a.length - 1].timestamp && a[a.length - 1].objectId) {
        timestamp = a[a.length - 1].timestamp
        objectId = a[a.length - 1].objectId
    }
    let ticketFromDB = null
    for (const ticket of a) {
        switch (ticket.changeType) {
            case "CHANGED":
                let changedTicket = await utils.getTicketById(ticket.objectId)
                ticketFromDB = await Ticket.findAll({
                    where: {
                        objectId: ticket.objectId
                    }
                })
                if (!utils.sameTicket(ticketFromDB[0].dataValues, changedTicket.properties.content)) {
                    let data = {
                        value: changedTicket.properties.content.value,
                        timestamp: changedTicket.properties.content.timestamp,
                        source: changedTicket.properties.content.source,
                        sourceId: changedTicket.properties.content.sourceId,
                        updatedByUserId: changedTicket.properties.content.updatedByUserId
                    }
                    Ticket.update(data, {
                        where: {
                            objectId: ticket.objectId
                        }
                    })
                }
                break;
            case "CREATED":
                let ticketNew = await utils.getTicketById(ticket.objectId)
                ticketFromDB = await Ticket.findAll({
                    where: {
                        objectId: ticket.objectId
                    }
                })
                const ticketData = {
                    value: ticketNew.properties.content.value,
                    timestamp: ticketNew.properties.content.timestamp,
                    source: ticketNew.properties.content.source,
                    sourceId: ticketNew.properties.content.sourceId,
                    updatedByUserId: ticketNew.properties.content.updatedByUserId
                }
                if (ticketFromDB.length !== 0) {
                    if (!utils.sameTicket(ticketNew.properties.content, ticketFromDB[0].dataValues)) {
                        Ticket.update(ticketData, {
                            where: {
                                objectId: ticket.objectId
                            }
                        })
                    }
                } else {
                    const NewTicket = {
                        objectId: ticket.objectId,
                        ...ticketData
                    }
                    Ticket.create(NewTicket)
                        .catch(err => {
                            console.log({
                                message:
                                    err.message || "Some error occurred while creating the Ticket."
                            });
                        });
                }
                break;
            default:
                break;
        }
    }
}

const syncTickets = async () => {
    const tickets = await utils.getAllTickets()
    for (const ticket of tickets) {
        let ticketFromDB = await Ticket.findAll({
            where: {
                objectId: ticket.objectId
            }
        })
        const ticketNew = {
            value: ticket.value,
            timestamp: ticket.timestamp,
            source: ticket.source,
            sourceId: ticket.sourceId,
            updatedByUserId: ticket.updatedByUserId
        }
        if (ticketFromDB.length !== 0) {
            if (!utils.sameTicket(ticket, ticketFromDB[0].dataValues)) {
                Ticket.update(ticketNew, {
                    where: {
                        objectId: ticket.objectId
                    }
                })
            }
        } else {
            const NewTicket = {
                objectId: ticket.objectId,
                ...ticketNew
            }
            Ticket.create(NewTicket)
                .catch(err => {
                    console.log({
                        message:
                            err.message || "Some error occurred while creating the Ticket."
                    });
                });
        }
    }

    timeoutSyncTickets()
    setTimeout(() => {
        timeoutSyncTickets()
    }, 10 * 60 * 1000);
}


syncContacts()
syncTickets()

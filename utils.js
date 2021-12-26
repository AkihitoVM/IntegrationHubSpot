const fetch = require('node-fetch');
require('dotenv').config()

const getAllContactsViaOffset = async (vidOffset) => {
    const response = await fetch(`https://api.hubapi.com/contacts/v1/lists/all/contacts/all?
    vidOffset=${vidOffset}&property=firstname&property=lastname&property=createdate`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${process.env.HUBSPOTTOKEN}` },
    })
    if (response.status === 401) {
        throw new Error("Unauthorized User")
    } else if (response.status === 200) {
        return response.json()
    }
}

const getRecentlyCreatedContactsViaOffset = async (vidOffset) => {
    const response = await fetch(`https://api.hubapi.com/contacts/v1/lists/recently_updated/contacts/recent?
    vidOffset=${vidOffset}&property=firstname&property=lastname&property=createdate&property=email`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${process.env.HUBSPOTTOKEN}` },
    })
    if (response.status === 401) {
        throw new Error("Unauthorized User")
    } else if (response.status === 200) {
        return response.json()
    }
}

const getAllContacts = async () => {
    let returnedContacts = []
    let vidOffset = 0

    while (true) {
        let parsedBody = await getAllContactsViaOffset(vidOffset)
        if (parsedBody.contacts.length > 0) {
            parsedBody.contacts.forEach(contact => {
                let data = {
                    vid: contact.vid,
                    firstname: contact.properties.firstname.value,
                    lastname: contact.properties.lastname.value,
                    createdate: new Date(parseInt(contact.properties.createdate.value))
                }
                returnedContacts.push(data)
            })
            if (!parsedBody["has-more"]) {
                break
            }
            vidOffset = parsedBody["vid-offset"]
        } else { break }
    }
    return returnedContacts

}

const getRecentlyCreatedContacts = async () => {
    let returnedContacts = []
    let vidOffset = 0

    while (true) {
        let parsedBody = await getRecentlyCreatedContactsViaOffset(vidOffset)
        if (parsedBody.contacts.length > 0) {
            parsedBody.contacts.forEach(contact => {
                let data = {
                    vid: contact.vid,
                    firstname: contact.properties.firstname.value,
                    lastname: contact.properties.lastname.value,
                    createdate: new Date(parseInt(contact.properties.createdate.value))
                }
                returnedContacts.push(data)
            })
            if (!parsedBody["has-more"]) {
                break
            }
            vidOffset = parsedBody["vid-offset"]
        } else { break }
    }
    return returnedContacts

}

const sameContact = (contact1, contact2) => {
    return contact1.firstname === contact2.dataValues.firstname &&
        contact1.lastname === contact2.dataValues.lastname
}

const sameTicket = (ticket1, ticket2) =>{
    return ticket1.value === ticket2.value &&
        ticket1.source === ticket2.source &&
        ticket1.sourceId === ticket2.sourceId &&
        ticket1.updatedByUserId === ticket2.updatedByUserId
}

const getAllTicketsViaOffset = async (vidOffset) => {
    const response = await fetch(`https://api.hubapi.com/crm-objects/v1/objects/tickets/paged?
    vidOffset=${vidOffset}&properties=content`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${process.env.HUBSPOTTOKEN}` },
    })
    if (response.status === 401) {
        throw new Error("Unauthorized User")
    } else if (response.status === 200) {
        return response.json()
    }
}

const getAllTickets = async () => {
    let tickets = []
    let vidOffset = 0

    while (true) {

        let parsedBody = await getAllTicketsViaOffset(vidOffset)

        if (parsedBody.objects.length > 0) {

            parsedBody.objects.forEach(object => {

                let data = {
                    objectId: object.objectId,
                    value: object.properties.content.value,
                    timestamp: new Date(object.properties.content.timestamp),
                    source: object.properties.content.source,
                    sourceId: object.properties.content.sourceId,
                    updatedByUserId: object.properties.content.updatedByUserId
                }

                tickets.push(data)
            })

            if (!parsedBody.hasMore) {
                break;
            }

            vidOffset = ticketsObj.offset
        } else { break; }
    }
    return tickets
}

const getLogOfChangesForTickets = async (timestamp,objectId,baseUrl) => {

    const url = (timestamp && objectId) ? 
        baseUrl+`?timestamp=${timestamp}&objectId=${objectId}` :
        baseUrl;

    const response = await fetch(url, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${process.env.HUBSPOTTOKEN}` },
    })
    if (response.status === 401) {
        throw new Error("Unauthorized User")
    } else if (response.status === 200) {
        return response.json()
    }
}


const getTicketById = async(id) =>{
    const response = await fetch(`https://api.hubapi.com/crm-objects/v1/objects/tickets/${id}?
    properties=subject&properties=content&properties=created_by&properties=hs_pipeline&properties=hs_pipeline_stage`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${process.env.HUBSPOTTOKEN}` },
    })
    if (response.status === 401) {
        throw new Error("Unauthorized User")
    } else if (response.status === 200) {
        return response.json()
    }
}

module.exports = { getAllContacts, getAllTickets, getRecentlyCreatedContacts,
                 sameContact, getLogOfChangesForTickets,getTicketById,sameTicket }
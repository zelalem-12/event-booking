const User = require('../../models/user');
const Event = require('../../models/event');
const { dateToString } = require('../../helpers/date');

const events = async eventIds => {
    try{
    const events = await Event.find({_id: {$in: eventIds}});
    return events.map(event => {
        return transformEvent(event);
    });
    } catch(err){
        throw err;
    };
};

const singleEvent = async eventId => {
    try{
    const event = await Event.findById(eventId);
    return transformEvent(event);
    } catch(err){
        throw err;
    }
}
const user = async userId => {
    try{
        const user = await User.findById(userId);
        return {...user._doc, createdEvents: events(user._doc.createdEvents)};
    } catch(err){
        throw err;
    }
};
const transformEvent = event => {
    return {
            ...event._doc,
            date: dateToString(event._doc.date),
            creater: user(event._doc.creater)
            }
};
const transformBooking  = booking => {
    return  { 
        ...booking._doc,
        event: singleEvent(booking._doc.event),
        user: user(booking._doc.user),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    };
};

exports.singleEvent = singleEvent;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
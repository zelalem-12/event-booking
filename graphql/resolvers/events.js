const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');

module.exports = {
    events: async _ => {
        try{
            const events = await Event.find();
            return events.map(event => {
                return transformEvent(event);
            });
        } catch(err){
            throw err
        }
    },
    createEvent:  async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: args.eventInput.price,
            date: new Date(args.eventInput.date),
            creater:"5ed2bd9ae15ac520a4902a51"
        });
        let createdEvent;
        try{
       const result = await event.save();
            createdEvent = transformEvent(result);
            const creater = await User.findById("5ed2bd9ae15ac520a4902a51");
            if(!creater){
                throw new Error('User not found');
            }
            creater.createdEvents.push(event);
            await creater.save(); 
             return createdEvent;
        }catch(err){
            throw err
        };
    }
}
const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { singleEvent, transformBooking } = require('./merge');

module.exports = {
    bookings: async _ => {
        try{
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            })
        }catch(err){
            throw err
        }
    },
    bookEvent: async args => {
        try{
        const fetchedEvent = await Event.findOne({_id: args.eventId});
        if(!fetchedEvent){
            throw new Error('Event not found');
        }
        const booking = new Booking({
                event: fetchedEvent._doc._id ,
                user: "5ed2ad79155af304c84a1b87"
        });
        const result = await booking.save();
            return transformBooking(result);
            } catch(err){
                throw err
            }
        },
        cancelBooking: async args => {
            try{
            const booking = await Booking.findById(args.bookingId);
            await Booking.deleteOne({_id: args.bookingId});
            return singleEvent(booking._doc.event);
            } catch(err){
                throw err;
            }
        }
}
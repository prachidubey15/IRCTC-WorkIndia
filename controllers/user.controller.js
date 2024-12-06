const Db = require('../db');
const TrainModel = require('../models/Train.model');
const BookingModel = require('../models/Booking.model');

// Controller for getting seat availability in train
exports.getSeatAvailability = async (req, res) => {
    const { src, dest } = req.query;
  
    
    if (!src || !dest) {
      return res.status(404).json({ message: 'Source and destination not found.' });
    }
  
    try {
      
      const Train = await TrainModel.fetchTrainWithCommonRoute(src, dest);
  
    
      if (Train.length === 0) {
        return res.status(404).json({ message: 'No trains found'});
      }
  
      const train_availability = Train.map(train => ({
        trainNo: train.trainNo,
        availableSeat: train.available_seats
      }));
  
      
      const trainHavingSeats = train_availability.filter(train => train.availableSeat > 0);
  
      res.status(200).json({
        leftSeats: trainHavingSeats.length > 0,
        leftTrainCount: trainHavingSeats.length, 
        trains: availableSeat
      });
    } catch (error) {
      console.error('Error in fetching seat availability:', error);
      res.status(500).json({ message: 'Error in fetching seat availability', error: error.message });
    }
  };
  

//Controller for booking seat in train
exports.bookingSeat = async (req, res) => {
    const { id, seat } = req.body;
    const userId = req.user.id;
  
    const conn = await Db.getConnection();
    try {
      console.log("Booking started now");
  
      
      await conn.beginTransaction();
      console.log("Transaction started now");
  
      
      const [train] = await conn.query('SELECT total_seats, available_seats FROM trains WHERE id = ? FOR UPDATE', [id]);
      console.log("Train fetched successfully:", train);
  
    
      if (!train.length) {
        console.log("Train not found");
        await conn.rollback();
        return res.status(404).json({ message: 'Train not found' });
      }
  
      const leftSeats = train[0].available_seats;
      console.log("Available seats:", leftSeats);
  
      if (leftSeats < seat) {
        console.log("Not enough seats available to book");
        await conn.rollback();
        return res.status(400).json({ message: 'Not enough seats available to book' });
      }
  
      await conn.query('UPDATE trains SET available_seats = available_seats - ? WHERE id = ?', [seat, id]);
      console.log("Seats updated successfully");
  
      
      await BookingModel.create(userId, id, seat, conn);
      console.log("Booking Done successfully"); 
  
      await conn.commit();
      res.status(201).json({ message: 'Seats booked successfully' });
    } catch (error) {
      console.error("Error in booking seat:", error.message); 
      await conn.rollback();
      res.status(500).json({ message: 'Error in booking seats', error: error.message });
    } finally {
      
      conn.release();
    }
  };


  
//Controller for fetching booking details
exports.FetchBookingDetails = async (req, res) => {
    const userId = req.user.id;
  
    try {
      const query = `
        SELECT 
          b.id AS booking_id,
          b.seats AS number_of_seats,
          t.trainNo,
          t.src,
          t.dest
        FROM bookings b
        JOIN trains t ON b.trainId = t.id
        WHERE b.userId = ?
      `;
  
      const [data] = await Db.query(query, [userId]);
      res.json(data);
    } catch (error) {
      console.error('Error in fetching booking details:', error.message);
      res.status(500).json({ message: 'Error in fetching booking details' });
    }
  };
  
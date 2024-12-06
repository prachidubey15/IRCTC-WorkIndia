const Db = require('../db');
const Train = require('../models/Train.model');


//Controller to add new Train
exports.addNewTrain = async (req, res) => {
    let trains = req.body; 
    
    if (!Array.isArray(trains)) {
      trains = [trains];
    }
  
    if (trains.length === 0) {
      return res.status(404).json({ message: 'No train provided to be added' });
    }
  
    try {
      const trainIds = []; 
  
      for (const train of trains) {
        const { trainNo, src, dest, total_seats } = train;
  
        
        if (!trainNo || !src || !dest || !total_seats) {
          return res.status(400).json({ message: 'Train number, src, dest, and total seats are required for each train.' });
        }
  
        const available_seats = total_seats;
  
        const [res] = await Db.query(
          'INSERT INTO trains (trainNo, src, dest, total_seats, available_seats) VALUES (?, ?, ?, ?, ?)',
          [trainNo, src, dest, total_seats, available_seats]
        );
  
    
        trainIds.push({ trainNo, id: res.insertId });
      }
  
    
      res.json({ message: 'Trains added successfully', trainIds });
    } catch (error) {
      res.status(500).json({ message: 'Error adding trains', error: error.message });
    }
  };
  
  //Controller for updating train seats
  exports.updateTrainSeats = async (req, res) => {
    const { id } = req.params;
    const { total_seats, available_seats } = req.body; 
  
    if (total_seats === undefined || available_seats === undefined) {
      return res.status(400).json({ message: 'Total seats and available seats are required' });
    }

    if (available_seats > total_seats) {
        return res.status(400).json({ message: 'Available seats cannot be greater than total seats' });
      }
  
    try {
      
      const updated = await Train.updateSeats(id, total_seats, available_seats);
  
      if (updated) {
        res.status(200).json({ message: 'Seats updated successfully' });
      } else {
        res.status(404).json({ message: 'Train not found or seats not updated' });
      }
    } catch (err) {
      console.error('Error updating train seats:', err.message);
      res.status(500).json({ message: 'Error updating train seats', error: err.message });
    }
  };
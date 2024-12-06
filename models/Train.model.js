const DB = require('../db');


exports.addNewTrain = async (trainNo, src, dest, total_seats) => {
  const available_seats = total_seats;
  try {
    const [res] = await DB.query(
      'INSERT INTO trains (trainNo, src, dest, total_seats, available_seats) VALUES (?, ?, ?, ?, ?)',
      [trainNo, src, dest, total_seats, available_seats]
    );
    return res.insertId;
  } catch (error) {
    throw new Error('Error while adding new train.');
  }
};

exports.fetchTrainDetails = async (id) => {
  try {
    const [data] = await DB.query('SELECT * FROM trains WHERE id = ?', [id]);
    return data[0];
  } catch (error) {
    throw new Error('Error while fetching train data');
  }
};

exports.fetchTrainWithCommonRoute = async (src, dest) => {
    try {   
         const formatSrc = src.trim().toLowerCase();
         const formatDest = dest.trim().toLowerCase();
 
         
            const [data] = await DB.query(`
             SELECT trainNo, src, dest, total_seats, available_seats
             FROM trains
             WHERE TRIM(LOWER(src)) = ? AND TRIM(LOWER(dest)) = ?
           `, [formatSrc, formatDest]);
        
         return data;
   
       } catch (error) {
         console.error('Error in fetching train:', error);
         throw new Error('Error in fetching train: ' + error.message);
       }
     };
    

exports.updateLeftSeats = async (id, seat) => {
  try {
    const [res] = await DB.query(
      'UPDATE trains SET available_seats = available_seats - ? WHERE id = ? AND available_seats >= ?',
      [seat, id, seat]
    );
    return res.affectedRows > 0;
  } catch (error) {
    throw new Error('Error updating available seats');
  }
};

exports.updateSeats = async (id, total, available_seats) => {
    try {
      const [res] = await DB.query(
        'UPDATE trains SET total_seats = ?, available_seats = ? WHERE id = ?',
        [total, available_seats, id]
      );
      return res.affectedRows > 0; // Return true if the update was successful
    } catch (error) {
      throw new Error('Error updating seats in the database: ' + error.message);
    }
};
const Bookings = {
  create: async (userId, trainId, seats, conn) => { 
    try {
      const query = `
        INSERT INTO bookings (userId, trainId, seats)
        VALUES (?, ?, ?)
      `;
      const [res] = await conn.query(query, [userId, trainId, seats]); 
     
      return res.insertId; // Return the new booking's ID
    } catch (error) {
     
      throw new Error('Error in creating bookings: ' + error.message);
    }
  },
};



module.exports = Bookings;

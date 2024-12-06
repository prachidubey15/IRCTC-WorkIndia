const DB = require('../db');

class User {
  constructor({ name, email, password, role = 'user' }) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

//   save the user to database
  async save() {
    try {
      const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
      const params = [this.name, this.email, this.password, this.role];

      const [res] = await DB.query(query, params);
      return res;
    } catch (err) {
      throw new Error(`Error while saving user: ${err.message}`);
    }
  }

//   Find a user email
  static async findUserByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = ?';
      const [data] = await DB.query(query, [email]);

      return data.length > 0 ? data[0] : null;
    } catch (err) {
      throw new Error(`Error in finding user: ${err.message}`);
    }
  }
}

module.exports = User;

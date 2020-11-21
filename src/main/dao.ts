import * as config from 'config';
import * as mysql from 'mysql';

export class Dao {
  private static daoInstance: Dao;
  private connection: any;
  constructor() {
    this.connectDb();
  }
  public static establishConnection(): Dao {
    if (!Dao.daoInstance) {
      Dao.daoInstance = new Dao();
    }
    return Dao.daoInstance;
  }
  private connectDb() {
    try {
      this.connection = mysql.createConnection({
        host: config.get('database_hot'),
        port: config.get('database_port'),
        user: config.get('database_user'),
        password: config.get('database_password'),
        database: config.get('database_name'),
      });
      this.connection.connect(err => {
        if (err) throw err;
        const sql =
          'CREATE TABLE IF NOT EXISTS `dates` (id INT AUTO_INCREMENT PRIMARY KEY, date_time VARCHAR(255), commissionsTotal VARCHAR(255), sales INT, leads INT, clicks INT, epc VARCHAR(255), impressions INT, cr VARCHAR(255))';
        this.connection.query(sql, function (err, result) {
          if (err) throw err;
        });
      });
    } catch (err) {
      throw new Error(
        `DB connection error: cant access to ${config.get('database_hot')}:${config.get('database_port')} ${err}`,
      );
    }
  }
  public async storeDates(dates) {
    console.log(dates, '____ DATES TO STORE _____');
    if (!dates) throw new Error('Nothing to store');
    await this.connection.query(
      'INSERT INTO `dates` (date_time, commissionsTotal, sales, leads, clicks, epc, impressions, cr) VALUES ?',
      [dates],
    );
    console.log('Dates has been stored');
  }
}

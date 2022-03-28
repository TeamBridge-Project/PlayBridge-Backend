import mongoose from 'mongoose';

class ReceiptRepository {
  private receiptSchema: mongoose.Schema;
  public model: mongoose.Model<{}, {}, {}>;

  constructor() {
    this.receiptSchema = new mongoose.Schema({
      uid: String,
      receiptId: String,
      paymentKey: String,
      date: Date,
      amount: Number
    }, { versionKey: false });
    this.model = mongoose.model('Receipts', this.receiptSchema);
  }

  public async find(filter: object) {
    try {
      const result = await this.model.find(filter);
      return result;
    } catch (e) {
      throw e;
    }
  }

  public async findOne(filter: object) {
    try {
      const result = await this.model.findOne(filter);
      return result;
    } catch (e) {
      throw e;
    }
  }
}
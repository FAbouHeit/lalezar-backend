import mongoose from 'mongoose';


const RateSchema = new mongoose.Schema({
    rate: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
    },
 },
 {
    timestamps: true,
  }

);


const Rate = mongoose.model('Rate',RateSchema);

export default Rate;


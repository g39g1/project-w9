import mongoose, { Schema, Document } from 'mongoose';

interface Historys extends Document {
  user: mongoose.Schema.Types.ObjectId;  
  weather: mongoose.Schema.Types.ObjectId;  
  lat: number;  
  lon: number;  
  requestedAt: Date;  
}


const historySchema: Schema = new Schema(
  {
    user: {
         type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
           required: true,
            index: true 
        },
    weather: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Weather', 
        required: true },

    lat: { type: Number,
         required: true
         },
    lon: { type: Number, 
        required: true 
    },
    requestedAt: { type: Date,
         default: Date.now,
          index: true
         },
  }
);

const History = mongoose.model<Historys>('History', historySchema);

export default History;

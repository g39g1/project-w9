import mongoose, { Schema, Document } from 'mongoose';

interface IWeather extends Document {
  lat: number;  
  lon: number;  
  data: any;    
  fetchedAt: Date;  
}

const weather: Schema = new Schema(
  {
    lat: { type: Number,
         required: true 
        },

    lon: { type: Number,
        
        required: true },

    data: { 
        type: mongoose.Schema.Types.Mixed, 
        required: true },

    fetchedAt: { type: Date,
         required: true },
  },
  { timestamps: true }
);



const Weather = mongoose.model<IWeather>('Weather', weather);

export default Weather;

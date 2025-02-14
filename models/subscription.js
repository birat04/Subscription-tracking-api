import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name : {
        type : String,
        required: [true, 'subscription name is required'],
        trim: true,
        minLength: 5,
        maxLength: 50,
    },
    price :{
        type : Number,
        required : [true, 'subscription price is required'],
        min : [0, 'price must be greater than 0'],
    },
    currency : {
        type : String,
        required : [true, 'currency is required'],
        enum : ['USD', 'EUR', 'NPR', 'INR'],
        default : 'INR',
    },
    frequency : {
        type : String,
        required : [true, 'frequency is required'],
        enum : ['daily', 'weekly', 'monthly', 'yearly'],
        default : 'monthly',
    },
    category : {
        type : String,
        required : [true, 'category is required'],
        enum : ['sports', 'news', 'entertainment', 'education', 'lifestyle', 
            'technology', 'finance', 'politics', 'health', 'travel', 'food', 'gaming', 'other'],
    },
    paymentMethod : {
        type : String,
        required : [true, 'payment method is required'],
        enum : ['credit card', 'debit card', 'net banking', 'upi', 'wallet'],
    },
   
    startDate : {
        type : Date,
        required : [true, 'start date is required'],
        validdate : {
            validator : (value) => value <= new Date(),
            message : 'start date must be past date',
        },
    },
   
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : [true, 'user is required'],
        index : true,
    },
}, {timestamps : true});

subscriptionSchema.pre('save', function(next){
    if(!this.renewalDate){
        const renewalPeriods = {
            daily : 1,
            weekly : 7,
            monthly : 30,
            yearly : 365,
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }
    if(this.renewalDate < new Date()){
        this.status = 'expired';
    }
    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
           

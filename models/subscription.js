import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minLength: [5, 'Name must be at least 5 characters long'],
        maxLength: [50, 'Name cannot exceed 50 characters'],
    },
    price: {
        type: Number,
        required: [true, 'Subscription price is required'],
        min: [0, 'Price must be greater than or equal to 0'],
        validate: {
            validator: Number.isFinite,
            message: 'Price must be a valid number'
        }
    },
    currency: {
        type: String,
        required: [true, 'Currency is required'],
        enum: {
            values: ['USD', 'EUR', 'NPR', 'INR'],
            message: '{VALUE} is not a supported currency'
        },
        default: 'INR',
    },
    frequency: {
        type: String,
        required: [true, 'Frequency is required'],
        enum: {
            values: ['daily', 'weekly', 'monthly', 'yearly'],
            message: '{VALUE} is not a supported frequency'
        },
        default: 'monthly',
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: ['sports', 'news', 'entertainment', 'education', 'lifestyle', 
                'technology', 'finance', 'politics', 'health', 'travel', 'food', 'gaming', 'other'],
            message: '{VALUE} is not a supported category'
        },
    },
    paymentMethod: {
        type: String,
        required: [true, 'Payment method is required'],
        enum: {
            values: ['credit card', 'debit card', 'net banking', 'upi', 'wallet'],
            message: '{VALUE} is not a supported payment method'
        },
    },
    status: {
        type: String,
        enum: {
            values: ['active', 'canceled', 'expired', 'suspended'],
            message: '{VALUE} is not a valid status'
        },
        default: 'active',
        select: false
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
        validate: {
            validator: function(value) {
                return value <= new Date();
            },
            message: 'Start date must be a past or current date'
        }
    },
    renewalDate: {
        type: Date,
        select: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User reference is required'],
        index: true,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
subscriptionSchema.index({ user: 1, status: 1 });
subscriptionSchema.index({ renewalDate: 1 });

// Virtual field for days until renewal
subscriptionSchema.virtual('daysUntilRenewal').get(function() {
    if (!this.renewalDate) return null;
    const now = new Date();
    const diffTime = this.renewalDate - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to set renewal date and update status
subscriptionSchema.pre('save', function(next) {
    try {
        // Set renewal date if not set
        if (!this.renewalDate) {
            const renewalPeriods = {
                daily: 1,
                weekly: 7,
                monthly: 30,
                yearly: 365,
            };
            this.renewalDate = new Date(this.startDate);
            this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
        }

        // Update status based on renewal date
        const now = new Date();
        if (this.renewalDate < now) {
            this.status = 'expired';
        }

        next();
    } catch (error) {
        next(error);
    }
});

// Pre-find middleware to exclude canceled and expired subscriptions by default
subscriptionSchema.pre(/^find/, function(next) {
    if (!this.getQuery().status) {
        this.find({ status: { $nin: ['canceled', 'expired'] } });
    }
    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
           

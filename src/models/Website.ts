import mongoose from 'mongoose';

// Define the Website interface
export interface IWebsite extends mongoose.Document {
  title: string;
  url: string;
  description: string;
  category: string;
  price: number;
  image: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  views: number;
  clicks: number;
  featured: boolean;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;

  // SEO Metrics
  DA?: number;
  PA?: number;
  Spam?: number;
  OrganicTraffic?: number;
  DR?: number;
  RD?: string;

  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  isNew: boolean;

  // Methods
  approve(reason?: string): Promise<IWebsite>;
  reject(reason: string): Promise<IWebsite>;
  isPending(): boolean;
  isApproved(): boolean;
  isRejected(): boolean;
}

// Define the static methods interface
interface WebsiteModel extends mongoose.Model<IWebsite> {
  findByStatus(status: string): mongoose.Query<IWebsite[], IWebsite>;
  findPending(): mongoose.Query<IWebsite[], IWebsite>;
  findApproved(): mongoose.Query<IWebsite[], IWebsite>;
  findRejected(): mongoose.Query<IWebsite[], IWebsite>;
  findByUser(userId: string, status?: string): mongoose.Query<IWebsite[], IWebsite>;
}

const WebsiteSchema = new mongoose.Schema({
  // Existing fields
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    unique: true,
    validate: {
      validator: function(v: string) {
        if (!v) return false;
        const urlToTest = v.match(/^https?:\/\//) ? v : `https://${v}`;
        try {
          new URL(urlToTest);
          return true;
        } catch (e) {
          return false;
        }
      },
      message: 'Please enter a valid URL'
    }
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'ecommerce',
      'blog',
      'portfolio',
      'business',
      'educational',
      'entertainment',
      'other'
    ]
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    default: '/default-website-image.png'
  },
  userId: {
    type: String,
    required: true
  },

  // Approval workflow
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedAt: {
    type: Date,
    default: null
  },
  rejectedAt: {
    type: Date,
    default: null
  },
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: [500, 'Rejection reason cannot exceed 500 characters'],
    default: ''
  },

  // Analytics
  views: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  tags: [{ type: String, trim: true }],

  // SEO fields
  metaTitle: {
    type: String,
    trim: true,
    maxlength: [60, 'Meta title cannot exceed 60 characters']
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  },

  // SEO Metrics
  DA: { type: Number },
  PA: { type: Number },
  Spam: { type: Number },
  OrganicTraffic: { type: Number },
  DR: { type: Number },
  RD: { type: String }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
WebsiteSchema.index({ userId: 1, status: 1 });
WebsiteSchema.index({ status: 1, createdAt: -1 });
WebsiteSchema.index({ category: 1, status: 1 });

// Virtual: isNew (less than 7 days old)
WebsiteSchema.virtual('isNew').get(function(this: IWebsite) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return this.createdAt > sevenDaysAgo;
});

// Pre-save hook to ensure status is set to pending when website is updated
WebsiteSchema.pre('save', function(this: IWebsite, next) {
  // If this is an update operation (not a new document) and any field other than status is modified
  if (!this.isNew && this.isModified()) {
    // Check if any field other than status, approvedAt, rejectedAt, or rejectionReason is modified
    const modifiedPaths = this.modifiedPaths();
    const contentFieldsModified = modifiedPaths.some(path => 
      !['status', 'approvedAt', 'rejectedAt', 'rejectionReason', '_id', 'updatedAt', 'createdAt'].includes(path)
    );
    
    // If content fields are modified and status is not explicitly set to 'approved' or 'rejected'
    // (which would only happen in admin actions), set status to 'pending'
    if (contentFieldsModified && this.status !== 'rejected' && this.status !== 'approved') {
      console.log('Setting website status to pending due to content field modifications');
      this.status = 'pending';
    }
  }
  next();
});

// Methods
WebsiteSchema.methods.approve = function(this: IWebsite, reason?: string) {
  this.status = 'approved';
  this.approvedAt = new Date();
  this.rejectionReason = '';
  return this.save();
};

WebsiteSchema.methods.reject = function(this: IWebsite, reason: string = '') {
  this.status = 'rejected';
  this.rejectedAt = new Date();
  this.rejectionReason = reason;
  return this.save();
};

WebsiteSchema.methods.isPending = function(this: IWebsite) {
  return this.status === 'pending';
};
WebsiteSchema.methods.isApproved = function(this: IWebsite) {
  return this.status === 'approved';
};
WebsiteSchema.methods.isRejected = function(this: IWebsite) {
  return this.status === 'rejected';
};

// Statics
WebsiteSchema.statics.findByStatus = function(status: string) {
  return this.find({ status }).sort({ createdAt: -1 });
};
WebsiteSchema.statics.findPending = function() {
  return this.find({ status: 'pending' }).sort({ createdAt: -1 });
};
WebsiteSchema.statics.findApproved = function() {
  return this.find({ status: 'approved' }).sort({ createdAt: -1 });
};
WebsiteSchema.statics.findRejected = function() {
  return this.find({ status: 'rejected' }).sort({ createdAt: -1 });
};
WebsiteSchema.statics.findByUser = function(userId: string, status?: string) {
  const query: any = { userId };
  if (status) query.status = status;
  return this.find(query).sort({ createdAt: -1 });
};

// Transform output
WebsiteSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    ret.id = ret._id?.toString();
    delete ret._id;
  }
});

// Final model
const Website = mongoose.models.Website as WebsiteModel 
  || mongoose.model<IWebsite, WebsiteModel>('Website', WebsiteSchema);

export default Website;

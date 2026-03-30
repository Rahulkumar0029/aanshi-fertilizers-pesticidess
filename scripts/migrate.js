const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Simple env loader
const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        env[match[1]] = value.trim();
    }
});

const MONGODB_URI = env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI not found');
    process.exit(1);
}

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: String },
    image: { type: String },
    description: { type: String },
    usage: { type: String },
}, { timestamps: true });

const InquirySchema = new mongoose.Schema({
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    productId: { type: String },
    productName: { type: String, required: true },
    productCategory: { type: String, required: true },
    status: { type: String, default: "pending" },
    timestamp: { type: String },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);

async function migrate() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected ✅');

        // Products
        const productsPath = path.join(__dirname, '../lib/data/products.json');
        if (fs.existsSync(productsPath)) {
            const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
            for (const p of products) {
                const { id, ...rest } = p;
                const exists = await Product.findOne({ name: rest.name });
                if (!exists) {
                    await Product.create(rest);
                    console.log(`Added product: ${rest.name}`);
                }
            }
        }

        // Inquiries
        const inquiriesPath = path.join(__dirname, '../lib/data/inquiries.json');
        if (fs.existsSync(inquiriesPath)) {
            const inquiries = JSON.parse(fs.readFileSync(inquiriesPath, 'utf-8'));
            for (const i of inquiries) {
                const { id, ...rest } = i;
                const exists = await Inquiry.findOne({ userName: rest.userName, timestamp: rest.timestamp });
                if (!exists) {
                    await Inquiry.create(rest);
                    console.log(`Added inquiry from: ${rest.userName}`);
                }
            }
        }

        console.log('Migration completed successfully ✅');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed ❌:', err.message);
        process.exit(1);
    }
}

migrate();

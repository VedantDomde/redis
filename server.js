import express from 'express';
import mongoose from 'mongoose';
// import Redis from 'ioredis';
// import { rateLimit } from 'express-rate-limit';
// import { RedisStore } from 'rate-limit-redis';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// ==========================================
// 1. MONGODB LOCAL CONNECTION (COMPASS)
// ==========================================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🍃 Local MongoDB Connected (Compass)'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Create a Dummy Product Schema & Model for Testing
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    Product: String
});
const Product = mongoose.model('Product', productSchema);


// ==========================================
// 2. IOREDIS CONNECTION SETUP
// ==========================================
// const redisClient = new Redis(process.env.REDIS_URL);

// redisClient.on('connect', () => {
//     console.log('⚡ Redis Cloud Connected Successfully via ioredis!');
// });

// redisClient.on('error', (err) => {
//     console.error('❌ ioredis Connection Error:', err.message);
// });
//

// ==========================================
// 🌟 NEW STEP 3: CONFIGURE RATE LIMIT PACKAGE WITH REDIS
// ==========================================
// const getRouteLimiter = rateLimit({
//     windowMs: 60 * 1000, // 1 Minute ka time window (60 seconds)
//     max: 5, // 1 Minute mein ek IP se MAX 5 requests allow hain
//     message: {
//         success: false,
//         message: "Too many requests! Aap 1 minute mein 5 baar se zyada products load nahi kar sakte. Kripya thoda rukiye."
//     },
//     standardHeaders: true, // `RateLimit-Limit` aur `RateLimit-Remaining` headers response mein bhejega
//     legacyHeaders: false, // Puraane X-RateLimit headers ko disable karega
    
    // Yahan hum package ko bol rahe hain ki saara data hamare Redis Cloud mein save kare
    // store: new RedisStore({
    //     sendCommand: (...args) => redisClient.call(args[0], ...args.slice(1)),
    //     prefix: 'rl-get-products:', // Redis cloud mein key ka naam isse shuru hoga
    // }),
// });


// ==========================================
// 4. PRACTICAL CACHING ROUTE (GET) WITH RATE LIMIT
// ==========================================
// Humne path ke baad 'getRouteLimiter' package wala middleware laga diya hai
app.get('/api/products', async (req, res) => {
    const cacheKey = 'products:all';

    try {
        // 1. Try checking the Redis notebook first
        // const cachedData = await redisClient.get(cacheKey);

        // if (cachedData) {
        //     console.log('--- Cache Hit: Fetching instantly from Redis ---');
        //     return res.status(200).json({
        //         success: true,
        //         source: 'Redis Cache Memory',
        //         data: JSON.parse(cachedData)
        //     });
        // }

        // 2. Cache Miss: Notebook is empty, fetch data from local MongoDB drive
        console.log('--- Cache Miss: Fetching from local MongoDB ---');
        const products = await Product.find({});

        // 3. Write data to Redis notebook so it's ready for the next request
        // if (products.length > 0) {
        //     await redisClient.set(cacheKey, JSON.stringify(products), 'EX', 300);
        // }

        return res.status(200).json({
            success: true,
            source: 'MongoDB Hard Drive',
            data: products
        });

    } catch (error) {
        console.error('Route Execution Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});


// ==========================================
// 5. SEED DATA ROUTE (To add data to MongoDB)
// ==========================================
app.post('/api/products', async (req, res) => {
    try {
        const { name, price, Product } = req.body;
        const newUser = await Product.create({ name, price, Product });
        console.log("createUser", newUser);
        
        // Jab bhi naya product bane, cache clear karo takki GET route fresh data de ske
        // await redisClient.del('products:all');
  
        return res.status(201).json({ 
            message: "Mock data seeded into local MongoDB successfully!",
            data: newUser
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


// ==========================================
// STARTING APPLICATION EXPRESS SERVER
// ==========================================
app.listen(PORT, () => {
    console.log(`🚀 Node.js Backend API running on port: ${PORT}`);
});

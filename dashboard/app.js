// Redis session store for Railway
const session = require("express-session");
const RedisStore = require("connect-redis").default;
const { createClient } = require("redis");

if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is missing in Railway Variables");
}

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on("error", (err) => {
    console.error("Redis connection error:", err);
});

await redisClient.connect();

app.use(
    session({
        store: new RedisStore({
            client: redisClient,
            prefix: "kaizer:sess:"
        }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "lax"
        }
    })
);

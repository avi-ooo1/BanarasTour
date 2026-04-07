import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './models/Product.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const staticAssetsPath = path.join(__dirname, '..', 'Frontend', 'src', 'assets');

const toursToSeed = [
    // Temples
    { name: "BHU Vishwanath Temple", category: "Temple", description: "Home to the magnificent New Vishwanath Temple (Birla Mandir).", localImage: "TopFamousAssets/BHU.jpeg" },
    { name: "Kashi Vishwanath Temple", category: "Temple", description: "One of the 12 Jyotirlingas, the spiritual heart of Varanasi.", localImage: "TopFamousAssets/Kashi Vishwanath Temple.jpeg" },
    { name: "Swarved Mahamandir Dham", category: "Temple", description: "Magnificent 7-floor meditation center dedicated to Vihangam Yoga.", localImage: "TopFamousAssets/Swarved Mahamandir Dham.jpg" },
    { name: "Annapurna Temple", category: "Temple", description: "Dedicated to Goddess Annapurna, the deity of food, near Kashi Vishwanath Temple.", localImage: "TempleAssets/AnnapurnaTemple.jpeg" },
    { name: "Durga Kund Mandir", category: "Temple", description: "Also known as the Monkey Temple, famous for its red color and historical significance.", localImage: "TempleAssets/DurgaKundMandirTemple.jpeg" },
    { name: "Kaal Bhairav Temple", category: "Temple", description: "Dedicated to Lord Kaal Bhairav, the fierce manifestation of Lord Shiva and protector of Varanasi.", localImage: "TempleAssets/KaalBhairavTemple.jpg" },
    { name: "Sankat Mochan Temple", category: "Temple", description: "Sacred temple dedicated to Lord Hanuman, believed to relieve devotees from all troubles.", localImage: "TempleAssets/SankatMochanTemple.jpg" },
    { name: "Tulsi Manas Temple", category: "Temple", description: "Historical temple where poet-saint Goswami Tulsidas wrote the Hindu epic Ramcharitmanas.", localImage: "TempleAssets/TulsiManasTemple.jpeg" },

    // Ghats
    { name: "Assi Ghat", category: "Ghat", description: "Known for the evening Aarti and as a focal point for pilgrims and tourists.", localImage: "GhatAssets/AssiGhat.jpg" },
    { name: "Dashashwamedh Ghat", category: "Ghat", description: "The most spectacular ghat, famous for the daily evening Ganga Aarti.", localImage: "GhatAssets/DashashwamedhGhat.webp" },
    { name: "Manikarnika Ghat", category: "Ghat", description: "The primary cremation ghat, considered a highly auspicious place in Hinduism.", localImage: "GhatAssets/ManikarnikaGhat.jpg" },
    { name: "Namo Ghat", category: "Ghat", description: "A newly renovated ghat featuring the iconic 'Namaste' sculpture.", localImage: "GhatAssets/NamoGhat.avif" },
    { name: "Scindia Ghat", category: "Ghat", description: "Known for the partially submerged Shiva Temple at its edge.", localImage: "GhatAssets/ScindiaGhat.jpg" },

    // Entertainment
    { name: "Sarnath (Dhamek Stupa)", category: "Entertainment", description: "Ancient Buddhist site where Lord Buddha preached his first sermon.", localImage: "TopFamousAssets/Sarnath (Dhamek Stupa).jpeg" },
    { name: "Ramnagar Fort", category: "Entertainment", description: "Historical sandstone fort on the eastern bank of the Ganges.", localImage: "TopFamousAssets/Ramnagar Fort.jpeg" },
    { name: "Water Park", category: "Entertainment", description: "Enjoy thrilling water rides and slides, the perfect getaway to beat the heat.", localImage: "EntertainmentAssets/WaterPark.jpg" },
    { name: "Gastropub", category: "Entertainment", description: "A lively place with a great ambiance, offering fantastic food and refreshing drinks.", localImage: "EntertainmentAssets/Gastropub.jpg" },
    { name: "Kankal Horror Restaurant", category: "Entertainment", description: "A spooky-themed dining experience combining delicious food with eerie, thrilling vibes.", localImage: "EntertainmentAssets/KankalHorrorRestaurant.jpg" },
    { name: "Ganga Aarti", category: "Ghat", description: "Spiritual evening prayer ceremony offering lamps to the holy river Ganges.", localImage: "TopFamousAssets/Ganga Aarti.jpeg" },

    // Sweets
    { name: "Madhur Milan Sweets (Launglata)", category: "Sweet", description: "A famous, traditional deep-fried sweet from Varanasi stuffed with khoya and sealed with a clove.", localImage: "SweetAssets/Launglata.png" },
    { name: "Shri Rajbandhu (Magadal)", category: "Sweet", description: "A mouth-watering, traditional pulse-based sweet from Varanasi loved by all.", localImage: "SweetAssets/Magadal.png" },
    { name: "Markandey Sardar (Malaiyo)", category: "Sweet", description: "A winter dawn-special fluffy, airy dessert made from raw milk dew and saffron.", localImage: "SweetAssets/Malaiyo.png" },
    { name: "Keshav Pan Bhandar (Banarasi Paan)", category: "Sweet", description: "Iconic mouth freshener celebrated in songs and culture.", localImage: "TopFamousAssets/Banarasi Paan.jpeg" },

    // Food
    { name: "The Ram Bhandar (Kachori Sabzi)", category: "Fast Food", description: "A popular hearty breakfast of Varanasi consisting of crispy kachoris and spicy potato curry.", localImage: "FoodAssets/KachoriSabzi.png" },
    { name: "Baati Chokha Restaurant (Baati Chokha)", category: "Fast Food", description: "A classic traditional dish of roasted wheat dough balls served with spicy mashed vegetables.", localImage: "FoodAssets/BaatiChokha.png" },
    { name: "Kashi Chat Bhandar (Tamatar Chaat)", category: "Fast Food", description: "Varanasi's special spicy and tangy street food made entirely with tomatoes and spices.", localImage: "FoodAssets/TamatarChaat.png" },
    { name: "Deena Chat Bhandar (Choora Matar)", category: "Fast Food", description: "A winter special breakfast dish in Varanasi made with flattened rice and green peas cooked in milk and cream.", localImage: "FoodAssets/ChooraMatar.png" },
    { name: "Deena Chat Bhandar (Chena Dahi Vada)", category: "Fast Food", description: "A unique variation of dahi vada made with paneer (chena) instead of lentil batter.", localImage: "FoodAssets/ChenaDahiVada.png" },
    { name: "Baba Thandai (Thandai)", category: "Fast Food", description: "A refreshing milk-based drink mixed with nuts and spices, especially famous during festivals.", localImage: "FoodAssets/Thandai.png" },
    { name: "Blue Lassi Shop (Lassi)", category: "Fast Food", description: "A rich, creamy yogurt-based beverage topped with malai, perfect for cooling down.", localImage: "FoodAssets/Lassi.png" },

    // Shopping
    { name: "Banarasi Silk Sarees (JDS Varanasi)", category: "Shopping", description: "World-famous luxurious silk sarees with intricate zari work.", localImage: "ShopingAssets/SilkSarees.png" },
    { name: "Rudraksha (Vishwanath Gali)", category: "Shopping", description: "Sacred prayer beads symbolizing spiritual energy and peace.", localImage: "ShopingAssets/Rudraksha.png" },
    { name: "Brass Idols (Thatheri Bazar)", category: "Shopping", description: "Intricately crafted divine brass idols showcasing Banaras artistry.", localImage: "ShopingAssets/BrassIdols.png" },
    { name: "Designer Bangles (Godowlia Market)", category: "Shopping", description: "Vibrant and beautiful glass bangles, a specialty of Banaras.", localImage: "ShopingAssets/DesignerBangles.png" }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB for seeding...");

        for (const tour of toursToSeed) {
            // Check if already exists
            const existing = await Product.findOne({ name: tour.name });
            if (existing) {
                console.log(`Skipping ${tour.name} - already exists.`);
                continue;
            }

            const imagePath = path.join(staticAssetsPath, tour.localImage);
            console.log(`Uploading image for ${tour.name}: ${imagePath}`);

            try {
                const uploadResult = await cloudinary.uploader.upload(imagePath, { resource_type: "image", folder: "banaras_tours" });
                
                await Product.create({
                    name: tour.name,
                    category: tour.category,
                    description: tour.description,
                    image: uploadResult.secure_url,
                    inStock: true
                });

                console.log(`Successfully added ${tour.name} to database.`);
            } catch (uploadError) {
                console.error(`Failed to upload image/save for ${tour.name}:`, uploadError.message);
            }
        }

        console.log("Seeding process completed.");
        process.exit(0);
    } catch (error) {
        console.error("Critical error during seeding:", error);
        process.exit(1);
    }
};

seedDB();

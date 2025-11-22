
🍽️ MealMitra – AI Based Food & Farmer Produce Donation System
A real-time platform connecting donors, NGOs, volunteers, and farmers to prevent food & crop wastage.
🚀 Overview

MealMitra is a smart platform designed to reduce food waste by connecting:

🍱 Food Donors (hostels, restaurants, events, canteens)

🙌 NGOs & Volunteers

🌾 Farmers with surplus crops

🏫 Community kitchens & beneficiaries

The system uses:

AI for food quantity estimation

Google Maps API for real-time tracking

Firebase for authentication + data storage

Firestore for real-time updates

⭐ New Feature: Farmer Surplus Crop Interface (Added to the App)

MealMitra now includes a dedicated Farmer Upload Interface where farmers can post unsold, excess, or low-value crops instead of throwing them away.

✔ Why this matters:

Helps farmers reduce losses during price crashes

Ensures fresh vegetables reach NGOs & community kitchens

Eliminates farm-level waste

Expands the impact of the platform beyond cooked food

⭐ What Farmers Can Upload:

Surplus vegetables

Fruits

Grains harvested in excess

Produce that cannot be sold due to low market price

🛠 How it works (Farmer Flow):

Farmer opens “Farmer Surplus Upload” page

Enters crop type, quantity, location

Posts the surplus produce

Nearest NGO or community kitchen receives request

Pickup & delivery are tracked in real-time

This appears as a new interface/page inside the MealMitra app.

✨ Core Features
🍽️ Food Donor Module

Upload leftover food

AI estimates servings

Add pickup timings

Track donation status

Auto-matching with nearest NGO

🙌 NGO / Volunteer Module

View available food & crop posts

Accept requests

Live navigation (Google Maps)

Mark actions: Accepted → Picked Up → Delivered

🌾 Farmer Surplus Crop Interface (NEW)

Upload unsold vegetables/crops

Add images, quantity, freshness notes

Auto-assign to nearby NGOs

Enables community kitchens to serve fresh meals

🗺️ Real-Time Map

Shows active NGOs nearby

Tracks volunteer from pickup → delivery

Uses Google Maps API

📡 Real-Time Matching Engine

Finds NGO/volunteer within set distance

First accept → task assigned

Firestore triggers update all screens live

🧠 Technology Stack
Layer	Tech
Frontend	React.js, Tailwind CSS
Backend	Firebase Firestore
Auth	Firebase Authentication
Storage	Firebase Storage
AI	TensorFlow Lite / Mock AI
Maps	Google Maps API
Deployment	Vercel + Firebase

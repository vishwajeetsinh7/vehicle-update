const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

// Models for MongoDB
const User = require("./models/User");  // User model
const Vehicle = require("./models/Vehicle");  // Vehicle model
const Service = require("./models/Service");  // Service model

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect("mongodb+srv://parakramrathod64:parakramrathod64@parakram.kyatgkr.mongodb.net/mydb", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Register user endpoint
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json("Email already exists");
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json("Database error");
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      return res.json("Success");
    } else {
      return res.json("Failed");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json("Database error");
  }
});

// Add Vehicle endpoint - Using image URL instead of file upload
app.post("/addVehicle", async (req, res) => {
  try {
    const { email, model, registrationNumber, vehicleType, purchaseDate, imageUrl } = req.body;

    // Ensure that the image URL is provided
    if (!imageUrl) {
      return res.status(400).json("Image URL is required");
    }

    // Check if vehicle already exists
    const existingVehicle = await Vehicle.findOne({ number: registrationNumber });
    if (existingVehicle) {
      return res.status(400).json("Vehicle already exists");
    }

    // Create new vehicle entry
    const vehicle = new Vehicle({
      email,
      model,
      number: registrationNumber,
      type: vehicleType,
      pdate: purchaseDate,
      image: imageUrl // Store the provided image URL
    });

    await vehicle.save();
    return res.json(vehicle);
  } catch (err) {
    console.error(err);
    return res.status(500).json("Error registering vehicle");
  }
});

// View vehicles by email
app.get("/viewVehicles", async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ email: req.query.email });
    return res.json(vehicles);
  } catch (err) {
    console.error(err);
    return res.status(500).json("Error retrieving vehicles");
  }
});

// Get Vehicle by ID
app.get("/getVehicle/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json("Vehicle not found");
    }
    return res.json(vehicle);
  } catch (err) {
    console.error(err);
    return res.status(500).json("Error fetching vehicle details");
  }
});

// Update Vehicle endpoint
app.put("/updateVehicle", async (req, res) => {
  try {
    const { id, email, model, registrationNumber, vehicleType, purchaseDate, imageUrl } = req.body;

    const updatedVehicleData = {
      model,
      number: registrationNumber,
      type: vehicleType,
      pdate: purchaseDate,
    };

    if (imageUrl) {
      updatedVehicleData.image = imageUrl; // Update the image URL if provided
    }

    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: id, email },
      updatedVehicleData,
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json("Vehicle not found or unauthorized update");
    }

    return res.json("Vehicle updated successfully");
  } catch (err) {
    console.error(err);
    return res.status(500).json("Error updating vehicle");
  }
});

// Delete Vehicle
app.delete('/deleteVehicle/:id', async (req, res) => {
  try {
    const result = await Vehicle.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json("Vehicle not found");
    }
    return res.json("Vehicle deleted successfully");
  } catch (err) {
    console.error(err);
    return res.status(500).json("Error deleting vehicle");
  }
});

// Add Service endpoint
app.post('/addService', async (req, res) => {
  try {
    const { maintenanceType, dateOfMaintenance, costOfMaintenance, registrationNumber } = req.body;

    if (!maintenanceType || !dateOfMaintenance || !costOfMaintenance || !registrationNumber) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const service = new Service({
      mtype: maintenanceType,
      mdate: dateOfMaintenance,
      mcost: costOfMaintenance,
      number: registrationNumber
    });

    await service.save();
    return res.json('Service registered successfully');
  } catch (err) {
    console.error(err);
    return res.status(500).json('Error registering service');
  }
});

// View Service by Vehicle Number
app.get('/viewServiceByNumber', async (req, res) => {
  try {
    const { number } = req.query;

    if (!number) {
      return res.status(400).json({ error: "Registration number is required" });
    }

    const services = await Service.find({ number }).sort({ mdate: -1 });
    return res.json(services);
  } catch (err) {
    console.error(err);
    return res.status(500).json("Error retrieving services");
  }
});

// View Registered Vehicle Numbers by Email
app.get('/viewRegisteredVehicles', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json('Email is required');
    }

    const vehicles = await Vehicle.find({ email }).select('number');
    return res.json(vehicles.map(vehicle => vehicle.number));
  } catch (err) {
    console.error(err);
    return res.status(500).json('Server Error');
  }
});

// Start server
app.listen(3004, () => {
  console.log("Server is listening on port 3004");
});

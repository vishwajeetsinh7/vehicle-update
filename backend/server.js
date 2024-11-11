const express = require("express");
const mysql = require('mysql');
const cors = require('cors');
var bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use("/imgupload",express.static("imgupload"));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "react"
})

const storage = multer.diskStorage({
    destination:path.join('imgupload/'),filename:function(req,file,callback){
        callback(null, Date.now()+'-'+path.extname(file.originalname))
    }
});

// app.post("/addpkg",(req,res)=>{
//     let upload = multer({storage:storage}).single('filename');
//     upload(req,res,function(err){
//         if(!req.file){
//             console.log("Not Found");
//         }else{
//             var desti_name = req.body.desti_name;
//             var stay_night = req.body.stay_night;
//             var start_price = req.body.start_price;
//             var filename = req.file.filename;
//             // res.send('');
//             const insert = "insert into destination(desti_name,stay_night,start_price,filename)values(?,?,?,?)";
//             con.query(insert,[desti_name,stay_night,start_price,filename]);
//             res.json('');
            
//         }
//     });
// });



// insert into users table
app.post("/register", (req, res) => {
    const checkEmailSql = "SELECT * FROM users WHERE email = ?";
    const insertUserSql = "INSERT INTO users (`name`, `email`, `password`) VALUES (?)";
    
    // Check if the email already exists
    db.query(checkEmailSql, [req.body.email], (err, result) => {
        if (err) {
            return res.status(500).json("Database error");
        }
        
        if (result.length > 0) {
            // Email already exists
            return res.json("Email already exists");
        } else {
            // Email does not exist, proceed to insert
            const values = [
                req.body.name,
                req.body.email,
                req.body.password
            ];

            db.query(insertUserSql, [values], (err, data) => {
                if (err) {
                    return res.json("Database error");
                }
                return res.json(data);
            });
        }
    });
});


// login using email of users table
app.post("/login",(req,res)=>{
    const sql="select * from users where `email` =?";
    const values = [
        req.body.email
    ]
    db.query(sql,[values],(err,data)=>{
        if(err){
            console.log("error")
        }
        if(data.length > 0){
            return res.json("Success");
        }else{
            return res.json("Failed");
        }
    })
})


// insert into vehicles table

app.post("/addVehicle", (req, res) => {
    const registrationNumber = req.body.registrationNumber;

    let upload = multer({storage:storage}).single(req.body.image);
    // First, check if the vehicle with the given registration number already exists
    const checkSql = "SELECT * FROM vehicles WHERE `number` = ?";
    db.query(checkSql, [registrationNumber], (checkErr, checkData) => {
        if (checkErr) {
            return res.json("Error Checking Existing Vehicle");
        }

        // If a record is found, return an error message
        if (checkData.length > 0) {
            return res.json("Record Already Exists");
        }

        // If no record found, proceed to insert the new vehicle
        const sql = "INSERT INTO vehicles (`email`,`model`, `number`, `type`, `pdate`, `image`) VALUES (?)";
        const values = [
            req.body.email,
            req.body.model,
            registrationNumber,
            req.body.vehicleType,
            req.body.purchaseDate,
            req.body.image
        ];

        db.query(sql, [values], (insertErr, insertData) => {
            if (insertErr) {
                return res.json("Error Registering vehicle");
            }
            return res.json(insertData);
        });
    });
});


// View vehicles from vehicles table using email
app.get("/viewVehicles", (req, res) => {
    const values =  [req.query.email];
    const sql = "SELECT * FROM vehicles where `email`=?";
    db.query(sql,[values], (err, data) => {
        if (err) {
            return res.json("Error retrieving vehicles" );
        }
        return res.json(data);
    });
});

// // update vehicle 
// app.post("/updateVehicle", (req, res) => {
//     const { id, email, model, registrationNumber, vehicleType, purchaseDate, image } = req.body;

//     // Check if the vehicle with the given ID exists
//     const checkSql = "SELECT * FROM vehicles WHERE id = ?";
//     db.query(checkSql, [id], (checkErr, checkData) => {
//         if (checkErr) {
//             return res.json("Error Checking Existing Vehicle");
//         }

//         // If no record found, return an error message
//         if (checkData.length === 0) {
//             return res.json("Vehicle Not Found");
//         }

//         // Prepare the update query
//         let updateSql = "UPDATE vehicles SET model = ?, number = ?, type = ?, pdate = ?, image = ? WHERE id = ?";
//         const values = [model, registrationNumber, vehicleType, purchaseDate, image, id];

//         // Execute the update query
//         db.query(updateSql, values, (updateErr, updateData) => {
//             if (updateErr) {
//                 return res.json("Error Updating Vehicle");
//             }
//             return res.json("Vehicle Updated Successfully");
//         });
//     });
// });

// GET /getVehicle/:id - Fetch vehicle details by ID
app.get('/getVehicle/:id', (req, res) => {
    const vehicleId = req.params.id;
    const query = 'SELECT * FROM vehicles WHERE id = ?';

    db.query(query, [vehicleId], (err, result) => {
        if (err) {
            console.error('Error fetching vehicle:', err);
            res.status(500).send('Error fetching vehicle details');
        } else if (result.length === 0) {
            res.status(404).send('Vehicle not found');
        } else {
            res.json(result[0]);
        }
    });
});

// PUT /updateVehicle - Update vehicle details
app.put('/updateVehicle', (req, res) => {
    const { id, email, model, registrationNumber, vehicleType, purchaseDate, image } = req.body;

    const query = `
        UPDATE vehicles
        SET model = ?, number = ?, type = ?, pdate = ?, image = ?
        WHERE id = ? AND email = ?
    `;

    db.query(query, [model, registrationNumber, vehicleType, purchaseDate, image, id, email], (err, result) => {
        if (err) {
            console.error('Error updating vehicle:', err);
            res.status(500).send('Error updating vehicle');
        } else if (result.affectedRows === 0) {
            res.status(404).send('Vehicle not found or unauthorized update');
        } else {
            res.send('Vehicle updated successfully');
        }
    });
});


//deleting Vehicle using id
app.delete('/deleteVehicle/:id', (req, res) => {
    const { id } = req.params;
    
    const sql = "delete from vehicles where id=?";
    db.query(sql,[id],(err,result)=>{
        if(err) return res.json("Error inside server.");
        return res.json("result");
    })
});


// Endpoint for fetching registered vehicle numbers based on email
app.get('/viewRegisteredVehicles', (req, res) => {
    const email = req.query.email;

    if (!email) {
        return res.json( 'Email is required' );
    }

    const query = 'SELECT DISTINCT number FROM vehicles WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error fetching vehicle registrations:', err);
            return res.json('Server Error');
        }

        const vehicleNumbers = results.map(vehicle => vehicle.number);
         return res.json(vehicleNumbers);
    });
});

// Endpoint for adding a service record
app.post('/addService', (req, res) => {
    const { maintenanceType, dateOfMaintenance, costOfMaintenance, registrationNumber } = req.body;

    if (!maintenanceType || !dateOfMaintenance || !costOfMaintenance || !registrationNumber) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = `INSERT INTO services ( mtype, mdate, mcost, number)
                    VALUES ( ?, ?, ?, ?)`;

    db.query(query, [ maintenanceType, dateOfMaintenance, costOfMaintenance, registrationNumber], (err, result) => {
        if (err) {
            console.error('Error registering service:', err);
            return res.json('Error registering service');
        }

        res.json('Service registered successfully');
    });
});



// GET endpoint to fetch services for a single registration number
app.get('/viewServiceByNumber', async (req, res) => {
    const  number  = req.query.number;

    // Validate the input
    if (!number) {
        console.error("Missing registration number in request");
        return res.status(400).json({ error: "Registration number is required" });
    }

    try {
        // SQL query to fetch services for a single registration number
        const query = `
            SELECT mtype, mdate, mcost, number
            FROM services
            WHERE number = ?
            ORDER BY mdate DESC;
        `;
        console.log('query done');
        // Ensure the database connection is established correctly
        if (!db) {
            console.error("Database connection is not established");
            return res.status(500).json({ error: "Database connection error" });
        }
        console.log('db done');


        // Execute the query with the provided registration number using async/await
        db.query(query, [number], (err, result) => {
            if (err) {
                console.log(err);
                console.error(`Error fetching services for ${number}`, err);
                return res.json(`Error fetching services for ${number}`, err);
            }
    
            res.json(result);
        });
        console.log('query execute');


        // // Check if records were found
        // if (!result || result.length === 0) {
        //     console.log(`No records found for registration number: ${number}`);
        //     return res.status(404).json({ message: "No maintenance records found for this registration number" });
        // }


        // // Respond with the fetched maintenance records
        // res.json(result);
    } catch (error) {
        // Log the error for debugging
        console.error('Error retrieving maintenance records:', error.message);
        console.error('Stack trace:', error.stack);

        // Return a 500 error with a detailed message
        res.status(500).json({ error: "Internal server error. Please try again later." });
    }
});




app.listen(8081, ()=>{
    console.log("listening");
})
require("dotenv").config();
const mongoose = require("mongoose");
const Doctor = require("./models/Doctor");

const doctors = [
    {
        name: "Dr. Amit Kapoor",
        specialization: "Cardiology",
        experience: 12,
        fees: 700,
        phone: "9876543201",
        email: "amit.kapoor@medsync.com",
        availability: "Available",
    },
    {
        name: "Dr. Neha Singh",
        specialization: "Cardiology",
        experience: 9,
        fees: 650,
        phone: "9876543202",
        email: "neha.singh@medsync.com",
        availability: "Available",
    },

    {
        name: "Dr. Vivek Mehta",
        specialization: "Neurology",
        experience: 15,
        fees: 1000,
        phone: "9876543203",
        email: "vivek.mehta@medsync.com",
        availability: "Available",
    },
    {
        name: "Dr. Priya Nair",
        specialization: "Neurology",
        experience: 10,
        fees: 900,
        phone: "9876543204",
        email: "priya.nair@medsync.com",
        availability: "Available",
    },

    {
        name: "Dr. Arjun Patel",
        specialization: "Orthopedics",
        experience: 14,
        fees: 800,
        phone: "9876543205",
        email: "arjun.patel@medsync.com",
        availability: "Available",
    },
    {
        name: "Dr. Kavita Rao",
        specialization: "Orthopedics",
        experience: 8,
        fees: 700,
        phone: "9876543206",
        email: "kavita.rao@medsync.com",
        availability: "Available",
    },

    {
        name: "Dr. Rohit Malhotra",
        specialization: "Dermatology",
        experience: 11,
        fees: 600,
        phone: "9876543207",
        email: "rohit.malhotra@medsync.com",
        availability: "Available",
    },
    {
        name: "Dr. Sneha Gupta",
        specialization: "Dermatology",
        experience: 7,
        fees: 550,
        phone: "9876543208",
        email: "sneha.gupta@medsync.com",
        availability: "Available",
    },

    {
        name: "Dr. Rajesh Sharma",
        specialization: "General Medicine",
        experience: 18,
        fees: 500,
        phone: "9876543209",
        email: "rajesh.sharma@medsync.com",
        availability: "Available",
    },
    {
        name: "Dr. Anjali Verma",
        specialization: "General Medicine",
        experience: 10,
        fees: 450,
        phone: "9876543210",
        email: "anjali.verma@medsync.com",
        availability: "Available",
    },

    {
        name: "Dr. Vikram Singh",
        specialization: "Surgery",
        experience: 20,
        fees: 1200,
        phone: "9876543211",
        email: "vikram.singh@medsync.com",
        availability: "Available",
    },
    {
        name: "Dr. Aditya Kulkarni",
        specialization: "Surgery",
        experience: 12,
        fees: 1100,
        phone: "9876543212",
        email: "aditya.kulkarni@medsync.com",
        availability: "Available",
    },
];

async function seedDoctors() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await Doctor.deleteMany();

        await Doctor.insertMany(doctors);

        console.log("Doctors Seeded Successfully");

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

seedDoctors();
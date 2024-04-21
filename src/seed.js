const mongoose = require("mongoose");
const faker = require("@faker-js/faker").faker;
const fs = require("fs");
const path = require("path");
const RouteModel = require("./frameworks/database/routeModel");

const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  require("dotenv").config({ path: envPath });
}

const mongoDBUri = process.env.MONGO_URI;

mongoose
  .connect(mongoDBUri)
  .then(async () => {
    console.log("MongoDB Connected...");

    await RouteModel.createIndexes([
      { key: { isDeleted: 1 } },
      { key: { "startPoint.city": 1 } },
      { key: { "startPoint.country": 1 } },
      { key: { "endPoint.city": 1 } },
      { key: { "endPoint.country": 1 } },
      { key: { status: 1 } },
    ]);
  })
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const generateSeedData = (numEntries) => {
  const seedData = [];
  for (let i = 0; i < numEntries; i++) {
    seedData.push({
      userId: faker.string.uuid(),
      vehicleId: faker.string.uuid(),
      startPoint: {
        city: faker.location.city(),
        country: faker.location.country(),
        coordinates: [faker.location.longitude(), faker.location.latitude()],
      },
      endPoint: {
        city: faker.location.city(),
        country: faker.location.country(),
        coordinates: [faker.location.longitude(), faker.location.latitude()],
      },
      startDate: faker.date.future(),
      estimatedEndDate: faker.date.future(),
      distance: faker.number.float({ min: 10, max: 500 }),
      duration: `${faker.number.int({ min: 1, max: 10 })} hours`,
      status: faker.helpers.arrayElement(["pending", "inProgress", "completed", "cancelled"], 1),
      avoidTolls: faker.datatype.boolean(),
      avoidHighways: faker.datatype.boolean(),
      isDeleted: false,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    });
  }
  return seedData;
};

const seedDatabase = async () => {
  try {
    const seedData = generateSeedData(1000);
    await RouteModel.insertMany(seedData);
    console.log("Database seeded successfully with 1000 entries!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();

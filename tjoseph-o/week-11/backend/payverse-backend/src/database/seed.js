const { User } = require('../models');
const { sequelize } = require('./connection');

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create sample users
    const users = await User.bulkCreate([
      {
        email: 'alice@payverse.com',
        password: 'password123',
        firstName: 'Alice',
        lastName: 'Johnson',
        accountBalance: 1000.00,
        role: 'user'
      },
      {
        email: 'bob@payverse.com',
        password: 'password123',
        firstName: 'Bob',
        lastName: 'Smith',
        accountBalance: 500.00,
        role: 'user'
      },
      {
        email: 'merchant@payverse.com',
        password: 'password123',
        firstName: 'Merchant',
        lastName: 'Store',
        accountBalance: 5000.00,
        role: 'merchant'
      }
    ], {
      individualHooks: true // This ensures password hashing hooks are called
    });

    console.log(`✅ Created ${users.length} sample users`);
    console.log('\n📋 Sample Accounts:');
    users.forEach(user => {
      console.log(`   ${user.email} | Balance: $${user.accountBalance} | Role: ${user.role}`);
    });
    console.log('\n🔑 Default Password: password123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Step 1: Deleting all user predictions...');
  const userPredResult = await prisma.userPrediction.deleteMany({});
  console.log(`🗑️ Deleted ${userPredResult.count} user predictions.`);

  console.log('🧹 Step 2: Deleting all predictions...');
  const predResult = await prisma.prediction.deleteMany({});
  console.log(`🗑️ Deleted ${predResult.count} predictions.`);
  
  console.log('✅ Done! Backend will regenerate fresh predictions on next sync.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

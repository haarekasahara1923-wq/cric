import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning up duplicate predictions...');
  
  const allMatches = await prisma.match.findMany({
    select: { id: true }
  });

  for (const match of allMatches) {
    const predictions = await prisma.prediction.findMany({
      where: { match_id: match.id },
      orderBy: { created_at: 'asc' }
    });

    const seen = new Set();
    for (const pred of predictions) {
      if (seen.has(pred.type)) {
        console.log(`🗑️ Deleting duplicate: Match ${match.id}, Type ${pred.type}, ID ${pred.id}`);
        await prisma.prediction.delete({
          where: { id: pred.id }
        });
      } else {
        seen.add(pred.type);
      }
    }
  }
  
  console.log('✅ Cleanup finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

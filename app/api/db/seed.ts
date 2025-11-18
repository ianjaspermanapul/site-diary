// This file should only run in Node.js environment, not in React Native/browser
// Check if we're in a Node.js environment
const isNodeEnvironment =
  typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

// If not in Node.js (e.g., being bundled by Metro), export empty object to prevent errors
if (!isNodeEnvironment) {
  if (typeof module !== 'undefined') {
    module.exports = {};
  }
  // Exit early - don't execute seed code
} else {
  // Only execute in Node.js environment
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { prisma } = require('./client');

  const defaultSiteDiaries = [
    {
      id: 'cm4lvx1rf00006fujdr7w5u9h',
      date: '2024-12-13',
      weather: {
        temperature: 20,
        description: 'sunny',
      },
      createdBy: 'John Doe',
      title: 'Test',
      content: 'Site diary entry to discuss the activities of the day',
      attendees: ['Jane Smith', 'John Doe'],
      attachments: [
        'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
    {
      id: 'cm4lvx1rf00007fujdr7w5u9i',
      date: '2024-12-12',
      weather: {
        temperature: 18,
        description: 'cloudy',
      },
      createdBy: 'Jane Smith',
      title: 'Progress Meeting',
      content: 'Detailed discussion on project milestones',
      attendees: ['John Doe', 'Mary Johnson'],
      attachments: [
        'https://images.unsplash.com/photo-1573497491208-6b1acb260507?q=80&w=1700&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
    {
      id: 'cm4lvx1rf00008fujdr7w5u9j',
      date: '2024-12-11',
      weather: {
        temperature: 22,
        description: 'partly cloudy',
      },
      createdBy: 'Mary Johnson',
      title: 'Inspection Report',
      content: 'Inspection of the northern site completed',
      attendees: ['Jane Smith', 'Robert Brown'],
      attachments: [
        'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
    {
      id: 'cm4lvx1rf00009fujdr7w5u9k',
      date: '2024-12-10',
      weather: {
        temperature: 16,
        description: 'rainy',
      },
      createdBy: 'Robert Brown',
      title: 'Safety Check',
      content: 'Conducted safety checks on all equipment',
      attendees: ['John Doe', 'Mary Johnson'],
      attachments: [],
    },
    {
      id: 'cm4lvx1rf00010fujdr7w5u9l',
      date: '2024-12-09',
      weather: {
        temperature: 19,
        description: 'windy',
      },
      createdBy: 'Jane Smith',
      title: 'Weekly Summary',
      content: 'Summarised the weekly progress on the project',
      attendees: ['Jane Smith', 'Robert Brown', 'Mary Johnson'],
      attachments: [
        'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=1900&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
  ];

  async function main() {
    console.log('🌱 Starting database seed...');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await prisma.attachment.deleteMany();
    await prisma.attendee.deleteMany();
    await prisma.weather.deleteMany();
    await prisma.siteDiary.deleteMany();

    // Seed the database with default values
    console.log('📝 Seeding site diaries...');
    for (const diary of defaultSiteDiaries) {
      await prisma.siteDiary.create({
        data: {
          id: diary.id,
          date: diary.date,
          createdBy: diary.createdBy,
          title: diary.title,
          content: diary.content,
          weather: diary.weather
            ? {
                create: {
                  temperature: diary.weather.temperature,
                  description: diary.weather.description,
                },
              }
            : undefined,
          attendees:
            diary.attendees && diary.attendees.length > 0
              ? {
                  create: diary.attendees.map((name) => ({ name })),
                }
              : undefined,
          attachments:
            diary.attachments && diary.attachments.length > 0
              ? {
                  create: diary.attachments.map((uri) => ({ uri })),
                }
              : undefined,
        },
      });
      console.log(`✅ Created site diary: ${diary.title}`);
    }

    console.log('✨ Seed completed successfully!');
  }

  main()
    .catch((e) => {
      console.error('❌ Error seeding database:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

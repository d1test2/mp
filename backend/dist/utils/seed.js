import { PrismaClient, CourseCategory } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    console.log('Seeding course categories and dummy courses...');
    const categories = [
        { id: CourseCategory.GETTING_STARTED, title: 'Getting Started', slug: 'getting-started' },
        { id: CourseCategory.SOURCING, title: 'Property Sourcing', slug: 'sourcing' },
        { id: CourseCategory.FINANCING, title: 'Financing Deals', slug: 'financing' },
        { id: CourseCategory.LEGAL, title: 'Legal & Compliance', slug: 'legal' },
        { id: CourseCategory.MANAGEMENT, title: 'Property Management', slug: 'management' },
        { id: CourseCategory.ADVANCED, title: 'Advanced Strategies', slug: 'advanced' },
    ];
    for (const cat of categories) {
        await prisma.courseCategoryModel.upsert({
            where: { id: cat.id },
            update: cat,
            create: cat,
        });
    }
    const dummyCourses = [
        {
            title: 'Introduction to PPAMP',
            slug: 'intro-to-ppamp',
            description: 'Learn the basics of our platform and how to navigate the courses.',
            categoryId: CourseCategory.GETTING_STARTED,
        },
        {
            title: 'Finding Your First Deal',
            slug: 'first-deal',
            description: 'Step-by-step guide to finding profitable property deals.',
            categoryId: CourseCategory.SOURCING,
        },
        {
            title: 'Commercial Financing 101',
            slug: 'comm-fin-101',
            description: 'Master the art of financing commercial properties.',
            categoryId: CourseCategory.FINANCING,
        },
        {
            title: 'HMO Licensing Masterclass',
            slug: 'hmo-masterclass',
            description: 'Everything you need to know about HMO licensing.',
            categoryId: CourseCategory.LEGAL,
        },
        {
            title: 'Portfolio Optimization',
            slug: 'portfolio-opt',
            description: 'Scale your property portfolio with advanced strategies.',
            categoryId: CourseCategory.ADVANCED,
        },
    ];
    for (const c of dummyCourses) {
        const course = await prisma.course.upsert({
            where: { slug: c.slug },
            update: c,
            create: c,
        });
        // Add dummy videos for each course
        await prisma.video.upsert({
            where: { id: `video-${c.slug}` },
            update: {},
            create: {
                id: `video-${c.slug}`,
                courseId: course.id,
                title: `Welcome to ${c.title}`,
                slug: 'welcome',
                videoUrl: 'https://youtu.be/NnA4P4ypNeQ?si=mq3ypVcB6E0HV8j3',
                sortOrder: 0,
                transcript: 'Welcome to this course. Here we will cover all the essentials...',
            },
        });
    }
    console.log('Seeding complete!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});

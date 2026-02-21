import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    await prisma.kpi.deleteMany();

    await prisma.kpi.createMany({
        data: [
            {
                name: "total-sales",
                description: "Total sales",
                category: "sales",
                value: 1000,
                unit: "$",
                targetValue: 1200,
                growthRate: 8,
                periodStart: new Date(),
                periodEnd: new Date(),
                metadata: {},
            },
            {
                name: "total-orders",
                description: "Total orders",
                category: "orders",
                value: 300,
                unit: "",
                targetValue: 350,
                growthRate: 5,
                periodStart: new Date(),
                periodEnd: new Date(),
                metadata: {},
            },
            {
                name: "products-sold",
                description: "Products sold",
                category: "products",
                value: 5,
                unit: "",
                targetValue: 10,
                growthRate: 12,
                periodStart: new Date(),
                periodEnd: new Date(),
                metadata: {},
            },
            {
                name: "new-customers",
                description: "New customers",
                category: "customers",
                value: 8,
                unit: "",
                targetValue: 15,
                growthRate: 0.5,
                periodStart: new Date(),
                periodEnd: new Date(),
                metadata: {},
            },
        ],
    });


    // seeding VisitorInsight data
    await prisma.visitorInsight.deleteMany();

    await prisma.visitorInsight.createMany({
        data: [
            { month: "Jan", year: 2025, loyalVisitors: 200, newVisitors: 250, uniqueVisitors: 220, totalVisitors: 670, growthRate: 0.08 },
            { month: "Feb", year: 2025, loyalVisitors: 210, newVisitors: 230, uniqueVisitors: 200, totalVisitors: 640, growthRate: 0.05 },
            { month: "Mar", year: 2025, loyalVisitors: 180, newVisitors: 240, uniqueVisitors: 210, totalVisitors: 630, growthRate: 0.04 },
            { month: "Apr", year: 2025, loyalVisitors: 250, newVisitors: 280, uniqueVisitors: 260, totalVisitors: 790, growthRate: 0.12 },
            { month: "May", year: 2025, loyalVisitors: 300, newVisitors: 320, uniqueVisitors: 290, totalVisitors: 910, growthRate: 0.15 },
            { month: "Jun", year: 2025, loyalVisitors: 270, newVisitors: 350, uniqueVisitors: 300, totalVisitors: 920, growthRate: 0.14 },
            { month: "Jul", year: 2025, loyalVisitors: 310, newVisitors: 370, uniqueVisitors: 330, totalVisitors: 1010, growthRate: 0.18 },
            { month: "Aug", year: 2025, loyalVisitors: 330, newVisitors: 390, uniqueVisitors: 350, totalVisitors: 1070, growthRate: 0.16 },
            { month: "Sep", year: 2025, loyalVisitors: 340, newVisitors: 410, uniqueVisitors: 360, totalVisitors: 1110, growthRate: 0.17 },
            { month: "Oct", year: 2025, loyalVisitors: 360, newVisitors: 430, uniqueVisitors: 380, totalVisitors: 1170, growthRate: 0.19 },
            { month: "Nov", year: 2025, loyalVisitors: 380, newVisitors: 450, uniqueVisitors: 400, totalVisitors: 1230, growthRate: 0.20 },
            { month: "Dec", year: 2025, loyalVisitors: 420, newVisitors: 480, uniqueVisitors: 430, totalVisitors: 1330, growthRate: 0.22 },
        ],
    });

    await prisma.revenue.deleteMany();

    await prisma.revenue.createMany({
        data: [
            {
                channel: "Mon",
                onlineSales: 1200,
                offlineSales: 800,
                totalRevenue: 2000,
                currency: "USD",
                periodStart: new Date("2026-01-01"),
                periodEnd: new Date("2026-01-01"),
                notes: "Monday sales",
            },
            {
                channel: "Tue",
                onlineSales: 2100,
                offlineSales: 1400,
                totalRevenue: 3500,
                currency: "USD",
                periodStart: new Date("2026-01-02"),
                periodEnd: new Date("2026-01-02"),
                notes: "Tuesday sales",
            },
            {
                channel: "Wed",
                onlineSales: 800,
                offlineSales: 600,
                totalRevenue: 1400,
                currency: "USD",
                periodStart: new Date("2026-01-03"),
                periodEnd: new Date("2026-01-03"),
                notes: "Wednesday sales",
            },
            {
                channel: "Thu",
                onlineSales: 1600,
                offlineSales: 1100,
                totalRevenue: 2700,
                currency: "USD",
                periodStart: new Date("2026-01-04"),
                periodEnd: new Date("2026-01-04"),
                notes: "Thursday sales",
            },
            {
                channel: "Fri",
                onlineSales: 2400,
                offlineSales: 1800,
                totalRevenue: 4200,
                currency: "USD",
                periodStart: new Date("2026-01-05"),
                periodEnd: new Date("2026-01-05"),
                notes: "Friday sales",
            },
            {
                channel: "Sat",
                onlineSales: 1800,
                offlineSales: 1300,
                totalRevenue: 3100,
                currency: "USD",
                periodStart: new Date("2026-01-06"),
                periodEnd: new Date("2026-01-06"),
                notes: "Saturday sales",
            },
            {
                channel: "Sun",
                onlineSales: 2200,
                offlineSales: 1600,
                totalRevenue: 3800,
                currency: "USD",
                periodStart: new Date("2026-01-07"),
                periodEnd: new Date("2026-01-07"),
                notes: "Sunday sales",
            },
        ],
    });

    await prisma.customerSatisfaction.deleteMany();

    await prisma.customerSatisfaction.createMany({
        data: [
            {
                date: new Date("2026-01-01"),
                dailyScore: 82,
                previousMonthAverage: 40,
                currentMonthAverage: 82,
                comparisonPercent: ((82 - 40) / 40) * 100,
                feedbackSummary: "Strong improvement from last month",
                metadata: {},
            },
            {
                date: new Date("2026-01-02"),
                dailyScore: 70,
                previousMonthAverage: 50,
                currentMonthAverage: 70,
                comparisonPercent: ((70 - 50) / 50) * 100,
                feedbackSummary: "Moderate growth",
                metadata: {},
            },
            {
                date: new Date("2026-01-03"),
                dailyScore: 79,
                previousMonthAverage: 25,
                currentMonthAverage: 79,
                comparisonPercent: ((79 - 25) / 25) * 100,
                feedbackSummary: "Huge jump in satisfaction",
                metadata: {},
            },
            {
                date: new Date("2026-01-04"),
                dailyScore: 65,
                previousMonthAverage: 26,
                currentMonthAverage: 65,
                comparisonPercent: ((65 - 26) / 26) * 100,
                feedbackSummary: "Steady improvement",
                metadata: {},
            },
            {
                date: new Date("2026-01-05"),
                dailyScore: 75,
                previousMonthAverage: 28,
                currentMonthAverage: 75,
                comparisonPercent: ((75 - 28) / 28) * 100,
                feedbackSummary: "Customer experience improving",
                metadata: {},
            },
            {
                date: new Date("2026-01-06"),
                dailyScore: 55,
                previousMonthAverage: 35,
                currentMonthAverage: 55,
                comparisonPercent: ((55 - 35) / 35) * 100,
                feedbackSummary: "Slight growth",
                metadata: {},
            },
            {
                date: new Date("2026-01-07"),
                dailyScore: 88,
                previousMonthAverage: 50,
                currentMonthAverage: 88,
                comparisonPercent: ((88 - 50) / 50) * 100,
                feedbackSummary: "Excellent performance",
                metadata: {},
            },
        ],
    });

    //target and reality

    await prisma.targetReality.deleteMany();

    await prisma.targetReality.createMany({
        data: [
            {
                periodStart: new Date("2026-01-01"),
                targetSales: 20000,
                actualSales: 18500,
            },
            {
                periodStart: new Date("2026-02-01"),
                targetSales: 22000,
                actualSales: 25000,
            },
            {
                periodStart: new Date("2026-03-01"),
                targetSales: 21000,
                actualSales: 19800,
            },
            {
                periodStart: new Date("2026-04-01"),
                targetSales: 24000,
                actualSales: 26000,
            },
            {
                periodStart: new Date("2026-05-01"),
                targetSales: 26000,
                actualSales: 25500,
            },
            {
                periodStart: new Date("2026-06-01"),
                targetSales: 28000,
                actualSales: 30000,
            },
            {
                periodStart: new Date("2026-07-01"),
                targetSales: 30000,
                actualSales: 29500,
            },
        ],
    });

    // volume vs service data
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    await prisma.volumeService.deleteMany();

    await prisma.volumeService.createMany({
        data: weekDays.map((day, index) => ({
            serviceName: day,
            serviceType: "DashboardMetric",
            usageCount: Math.floor(Math.random() * 100) + 50, // volume
            averageResponseTime: Math.random() * 2,            // optional
            successRate: Math.random() * 20 + 80,             // service level %
            errorRate: Math.random() * 5,
            metadata: {},
            recordedAt: new Date(`2026-02-0${index + 1}`),
        })),
    });

    //top-products
    await prisma.topProduct.deleteMany();

    await prisma.topProduct.createMany({
        data: [
            {
                name: "Home Decor Range",
                sku: "HDR001",
                category: "Home",
                totalSales: 45,
                unitsSold: 78,
                revenue: 45000,
                averageRating: 4.5,
                periodStart: new Date("2026-01-01"),
                periodEnd: new Date("2026-01-31"),
                metadata: {},
            },
            {
                name: "Disney Princess Dress",
                sku: "DPD002",
                category: "Fashion",
                totalSales: 29,
                unitsSold: 62,
                revenue: 29000,
                averageRating: 4.2,
                periodStart: new Date("2026-01-01"),
                periodEnd: new Date("2026-01-31"),
                metadata: {},
            },
            {
                name: "Bathroom Essentials",
                sku: "BE003",
                category: "Home",
                totalSales: 18,
                unitsSold: 51,
                revenue: 18000,
                averageRating: 4.1,
                periodStart: new Date("2026-01-01"),
                periodEnd: new Date("2026-01-31"),
                metadata: {},
            },
            {
                name: "Apple Smartwatch",
                sku: "AS004",
                category: "Electronics",
                totalSales: 61,
                unitsSold: 85,
                revenue: 61000,
                averageRating: 4.8,
                periodStart: new Date("2026-01-01"),
                periodEnd: new Date("2026-01-31"),
                metadata: {},
            },
        ],
    });

    await prisma.salesMap.deleteMany();

    await prisma.salesMap.createMany({
        data: [
            {
                country: "United States",
                totalSales: 450000,
                periodStart: new Date("2026-01-01"),
                periodEnd: new Date("2026-01-31"),
            },
            {
                country: "Canada",
                totalSales: 180000,
                periodStart: new Date("2026-01-01"),
                periodEnd: new Date("2026-01-31"),
            },
            {
                country: "Brazil",
                totalSales: 95000,
                periodStart: new Date("2026-01-01"),
                periodEnd: new Date("2026-01-31"),
            },
            {
                country: "United Kingdom",
                totalSales: 210000,
                periodStart: new Date("2026-01-01"),
                periodEnd: new Date("2026-01-31"),
            },
            {
                country: "Germany",
                totalSales: 170000,
                periodStart: new Date("2026-01-01"),
                periodEnd: new Date("2026-01-31"),
            },
            {
                country: "Nigeria",
                totalSales: 75000,
                periodStart: new Date("2026-01-01"),
                periodEnd: new Date("2026-01-31"),
            },
            {
                country: "India",
                totalSales: 260000,
                periodStart: new Date("2026-01-01"),
                periodEnd: new Date("2026-01-31"),
            },
            {
                country: "Australia",
                totalSales: 120000,
                periodStart: new Date("2026-01-01"),
                periodEnd: new Date("2026-01-31"),
            },
        ],
    });

    console.log("✅ Seed done");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

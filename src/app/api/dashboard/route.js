import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Candidate from '@/lib/models/Candidate';

// GET /api/dashboard - Get dashboard statistics
export async function GET() {
  try {
    await connectDB();

    const [total, stageCounts, recentCandidates, positionCounts] = await Promise.all([
      Candidate.countDocuments(),
      Candidate.aggregate([
        { $group: { _id: '$stage', count: { $sum: 1 } } },
      ]),
      Candidate.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Candidate.aggregate([
        { $group: { _id: '$position', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
    ]);

    // Transform stage counts into a map
    const stageMap = {};
    const allStages = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];
    allStages.forEach((stage) => {
      stageMap[stage] = 0;
    });
    stageCounts.forEach(({ _id, count }) => {
      stageMap[_id] = count;
    });

    // Calculate active candidates (not Hired or Rejected)
    const active = total - (stageMap['Hired'] || 0) - (stageMap['Rejected'] || 0);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          total,
          active,
          hired: stageMap['Hired'] || 0,
          rejected: stageMap['Rejected'] || 0,
        },
        stageCounts: allStages.map((stage) => ({
          stage,
          count: stageMap[stage],
        })),
        recentCandidates,
        positionCounts: positionCounts.map(({ _id, count }) => ({
          position: _id,
          count,
        })),
      },
    });
  } catch (error) {
    console.error('GET /api/dashboard error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

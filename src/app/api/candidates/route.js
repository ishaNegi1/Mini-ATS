import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Candidate from '@/lib/models/Candidate';

// GET /api/candidates - List all candidates with optional search & filters
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const stage = searchParams.get('stage') || '';
    const position = searchParams.get('position') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Build filter query
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (stage) {
      filter.stage = stage;
    }

    if (position) {
      filter.position = { $regex: position, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const [candidates, total] = await Promise.all([
      Candidate.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Candidate.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: candidates,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/candidates error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch candidates' },
      { status: 500 }
    );
  }
}

// POST /api/candidates - Create a new candidate
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    // Server-side validation
    const { name, email, phone, position, stage, notes } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    if (!position || !position.trim()) {
      return NextResponse.json(
        { success: false, error: 'Position is required' },
        { status: 400 }
      );
    }

    // Check for duplicate email
    const existingCandidate = await Candidate.findOne({ email: email.toLowerCase().trim() });
    if (existingCandidate) {
      return NextResponse.json(
        { success: false, error: 'A candidate with this email already exists' },
        { status: 409 }
      );
    }

    const candidate = await Candidate.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || '',
      position: position.trim(),
      stage: stage || 'Applied',
      notes: notes?.trim() || '',
    });

    return NextResponse.json(
      { success: true, data: candidate },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/candidates error:', error);

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'A candidate with this email already exists' },
        { status: 409 }
      );
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return NextResponse.json(
        { success: false, error: messages.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create candidate' },
      { status: 500 }
    );
  }
}

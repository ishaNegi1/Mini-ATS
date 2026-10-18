import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Candidate from '@/lib/models/Candidate';

// GET /api/candidates/[id] - Get a single candidate
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid candidate ID' },
        { status: 400 }
      );
    }

    const candidate = await Candidate.findById(id).lean();

    if (!candidate) {
      return NextResponse.json(
        { success: false, error: 'Candidate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: candidate });
  } catch (error) {
    console.error('GET /api/candidates/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch candidate' },
      { status: 500 }
    );
  }
}

// PUT /api/candidates/[id] - Update a candidate
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid candidate ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, email, phone, position, stage, notes } = body;

    // Validation
    if (name !== undefined && !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Name cannot be empty' },
        { status: 400 }
      );
    }

    if (email !== undefined) {
      if (!email.trim()) {
        return NextResponse.json(
          { success: false, error: 'Email cannot be empty' },
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

      // Check for duplicate email (excluding the current candidate)
      const existingCandidate = await Candidate.findOne({
        email: email.toLowerCase().trim(),
        _id: { $ne: id },
      });
      if (existingCandidate) {
        return NextResponse.json(
          { success: false, error: 'A candidate with this email already exists' },
          { status: 409 }
        );
      }
    }

    if (position !== undefined && !position.trim()) {
      return NextResponse.json(
        { success: false, error: 'Position cannot be empty' },
        { status: 400 }
      );
    }

    const validStages = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];
    if (stage !== undefined && !validStages.includes(stage)) {
      return NextResponse.json(
        { success: false, error: `Stage must be one of: ${validStages.join(', ')}` },
        { status: 400 }
      );
    }

    // Build update object
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (email !== undefined) updateData.email = email.toLowerCase().trim();
    if (phone !== undefined) updateData.phone = phone.trim();
    if (position !== undefined) updateData.position = position.trim();
    if (stage !== undefined) updateData.stage = stage;
    if (notes !== undefined) updateData.notes = notes.trim();

    const candidate = await Candidate.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!candidate) {
      return NextResponse.json(
        { success: false, error: 'Candidate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: candidate });
  } catch (error) {
    console.error('PUT /api/candidates/[id] error:', error);

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
      { success: false, error: 'Failed to update candidate' },
      { status: 500 }
    );
  }
}

// DELETE /api/candidates/[id] - Delete a candidate
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid candidate ID' },
        { status: 400 }
      );
    }

    const candidate = await Candidate.findByIdAndDelete(id).lean();

    if (!candidate) {
      return NextResponse.json(
        { success: false, error: 'Candidate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Candidate deleted successfully',
    });
  } catch (error) {
    console.error('DELETE /api/candidates/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete candidate' },
      { status: 500 }
    );
  }
}

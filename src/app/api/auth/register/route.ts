import { NextRequest, NextResponse } from 'next/server';
import { generateToken, hashPassword } from '@/lib/auth';
import { registerSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, password, role } = validation.data;

    // Check if user already exists (mock check)
    // In real implementation, check against database
    if (email === 'admin@codestam.com') {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user (mock creation)
    const newUser = {
      id: Date.now().toString(),
      email,
      name: `${firstName} ${lastName}`,
      role,
      permissions: role === 'admin' ? ['*'] : ['dashboard:view'],
    };

    // Generate JWT token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      permissions: newUser.permissions,
    });

    // Return user data and token
    return NextResponse.json({
      user: newUser,
      token,
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
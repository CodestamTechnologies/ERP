import { NextRequest, NextResponse } from 'next/server';

// GET /api/customers - Get all customers
export async function GET(request: NextRequest) {
  try {
    // TODO: Implement actual database query
    const customers = [
      {
        id: '1',
        name: 'TechCorp Solutions',
        contactPerson: 'John Smith',
        email: 'john@techcorp.com',
        phone: '+1 555-0123',
        company: 'TechCorp Solutions',
        type: 'business',
        status: 'active',
        totalOrders: 25,
        totalSpent: 1250000,
        lastOrder: '2024-01-15',
        location: 'New York, USA',
        rating: 4.8,
        createdAt: '2023-03-15',
        updatedAt: '2024-01-15'
      },
      // Add more mock data as needed
    ];

    return NextResponse.json({
      success: true,
      data: customers,
      total: customers.length
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// POST /api/customers - Create new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Validate input data
    // TODO: Implement actual database insertion
    
    const newCustomer = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: newCustomer,
      message: 'Customer created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}
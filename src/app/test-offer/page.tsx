'use client';

export default function TestOfferPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-red-600">
        TEST OFFER LETTER PAGE
      </h1>
      <p className="text-gray-600 mt-2">
        This is a test page at /test-offer to verify routing works.
      </p>
      <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded">
        <p className="text-red-800">
          ✅ If you can see this page, basic routing is working!
        </p>
      </div>
    </div>
  );
}
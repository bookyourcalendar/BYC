export async function GET() {
  // Mock data
  const tickets = [
    {
      id: "1",
      fullName: "John Doe",
      email: "john@example.com",
      description: "Issue with login",
      issueType: "Login",
      status: "Open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      fullName: "Jane Smith",
      email: "jane@example.com",
      description: "Payment not processed",
      issueType: "Payment",
      status: "Closed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  return Response.json(tickets);
} 
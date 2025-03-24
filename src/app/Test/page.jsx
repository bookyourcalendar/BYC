export default function Dashboard() {
    return (
      <div className="min-h-screen bg-white text-gray-800 p-6">
        {/* Main Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        </div>
  
        {/* First Div with 4 Cards (1 per row on small screens, 4 per row on large screens) */}
        <div className="mb-8">
          <div className="text-2xl font-semibold mb-4">Statistics</div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-gray-100 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium">Card {item}</h3>
              </div>
            ))}
          </div>
        </div>
  
        {/* Second Div with 3 Cards (1 per row on small screens, 3 per row on large screens) */}
        <div className="mb-8">
          <div className="text-2xl font-semibold mb-4">Recent Activities</div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gray-100 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium">Card {item}</h3>
              </div>
            ))}
          </div>
        </div>
  
        {/* Grid with Graph and Pie Chart */}
        <div>
          <div className="text-2xl font-semibold mb-4">Analytics</div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md h-64">
              <h3 className="text-lg font-medium">Graph Section</h3>
              {/* Add your graph component here */}
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md h-64">
              <h3 className="text-lg font-medium">Pie Chart Section</h3>
              {/* Add your pie chart component here */}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
import React, { useState } from 'react';
import Header from '../components/Header';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Search, Users, Calendar } from 'lucide-react';

// Function to add alumni details to local storage
function addAlumni(alumni) {
    let alumniList = JSON.parse(localStorage.getItem('alumniList')) || [];
    alumniList.push(alumni);
    localStorage.setItem('alumniList', JSON.stringify(alumniList));
    console.log('Alumni added successfully!');
}

// Function to add an event by an alumni
function addEvent(event) {
    let eventList = JSON.parse(localStorage.getItem('eventList')) || [];
    eventList.push(event);
    localStorage.setItem('eventList', JSON.stringify(eventList));
    console.log('Event added successfully!');
}

// Function to fetch all alumni
function getAlumni() {
    return JSON.parse(localStorage.getItem('alumniList')) || [];
}

// Function to fetch all events
function getEvents() {
    return JSON.parse(localStorage.getItem('eventList')) || [];
}

// Example Usage
// Adding an alumni
addAlumni({
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    department: 'Computer Science',
    graduationYear: 2020
});

// Adding an event by an alumni
addEvent({
    id: 1,
    alumniId: 1, // Link to the alumni who created the event
    eventName: 'Tech Talk',
    eventDate: '2025-05-20',
    description: 'A talk on emerging technologies.'
});

// Fetching and displaying alumni
console.log('Alumni:', getAlumni());

// Fetching and displaying events
console.log('Events:', getEvents());

const AlumniDashboard: React.FC = () => {
  const { user } = useAuth();
  const { alumni, events, getNotableAlumni } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  
  const notableAlumni = getNotableAlumni();
  
  // Filter alumni based on search term and department
  const filteredAlumni = alumni.filter(alum => {
    if (alum.id === user?.id) return false; // Don't show current user
    
    const matchesSearch = 
      alum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.company?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesDepartment = selectedDepartment === '' || alum.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });
  
  const departments = Array.from(new Set(alumni.map(alum => alum.department)));
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 mb-8">
          <h1 className="text-2xl font-bold text-blue-900 mb-2">Welcome Back, {user?.name}!</h1>
          <p className="text-gray-600">Stay connected with your alma mater and fellow alumni.</p>
        </div>
        
        {/* Notable Alumni Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Users className="h-5 w-5 text-blue-900 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Notable Alumni</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notableAlumni.map(alum => (
              <div key={alum.id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-200 hover:scale-105">
                <div className="bg-gradient-to-r from-blue-800 to-blue-900 py-3 px-4">
                  <h3 className="text-lg font-bold text-white">{alum.name}</h3>
                  <p className="text-blue-100 text-sm">Class of {alum.graduationYear}</p>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 mb-2">{alum.department}</p>
                  {alum.company && (
                    <p className="text-gray-800 font-medium">
                      {alum.position} at {alum.company}
                    </p>
                  )}
                  
                  {alum.achievements && alum.achievements.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Achievements:</p>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {alum.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Network with Alumni Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Search className="h-5 w-5 text-blue-900 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Network with Alumni</h2>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search by name, position, or company
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g., John Smith, Software Engineer, Google"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="md:w-1/4">
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by department
                </label>
                <select
                  id="department"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.length > 0 ? (
              filteredAlumni.map(alum => (
                <div key={alum.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{alum.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">Class of {alum.graduationYear} • {alum.department}</p>
                    
                    {alum.company && (
                      <p className="text-gray-800">
                        {alum.position} at {alum.company}
                      </p>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button className="text-blue-600 hover:text-blue-800 transition duration-150 text-sm font-medium">
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-gray-500">
                No alumni found matching your criteria. Try adjusting your search.
              </div>
            )}
          </div>
        </div>
        
        {/* Upcoming Events Section */}
        <div>
          <div className="flex items-center mb-4">
            <Calendar className="h-5 w-5 text-blue-900 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Upcoming Events</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map(event => (
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{event.title}</h3>
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{event.description}</p>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-4">📍 {event.location}</span>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end">
                    <button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm transition duration-150">
                      RSVP to Event
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AlumniDashboard;
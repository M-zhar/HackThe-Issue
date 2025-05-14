import React, { useState } from 'react';
import Header from '../components/Header';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Search, Users, Calendar, Star } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { alumni, events, getNotableAlumni, requestMentorship } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  
  const notableAlumni = getNotableAlumni();
  const [myMentors, setMyMentors] = useState<string[]>([]);
  
  const filteredAlumni = alumni.filter(alum => {
    const matchesSearch = 
      alum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.company?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesDepartment = selectedDepartment === '' || alum.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });
  
  const filteredEvents = events.filter(event => {
    const matchesDepartment = selectedDepartment === '' || alumni.find(alum => alum.id === event.alumniId)?.department === selectedDepartment;
    return matchesDepartment;
  });

  const departments = Array.from(new Set(alumni.map(alum => alum.department)));
  
  const handleMentorshipRequest = (alumniId: string) => {
    requestMentorship(user?.id || '', alumniId);
    setMyMentors([...myMentors, alumniId]);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden p-8 mb-8 border-l-4 border-indigo-600">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h1>
              <p className="text-gray-600 text-lg">Find your mentor and build your future.</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Developed by</p>
              <p className="text-indigo-600 font-semibold">Code Elevater</p>
            </div>
          </div>
        </div>
        
        {/* Search Alumni Section */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <Search className="h-6 w-6 text-indigo-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Find Your Mentor</h2>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search alumni by name, position, or company..."
                  className="w-full px-4 py-3 text-lg border-2 border-indigo-100 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              
              <div className="md:w-1/3">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-indigo-100 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAlumni.map(alum => (
              <div key={alum.id} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <div className="relative">
                  <div className="absolute top-4 right-4">
                    {alum.isNotable && (
                      <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        Notable Alumni
                      </div>
                    )}
                  </div>
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                    <h3 className="text-xl font-bold text-white mb-1">{alum.name}</h3>
                    <p className="text-indigo-100">Class of {alum.graduationYear}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-gray-600">{alum.department}</p>
                    {alum.company && (
                      <p className="text-gray-900 font-semibold mt-1">
                        {alum.position} at {alum.company}
                      </p>
                    )}
                  </div>
                  
                  {alum.achievements && alum.achievements.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Notable Achievements:</p>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {alum.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    {myMentors.includes(alum.id) ? (
                      <div className="text-green-600 font-medium flex items-center">
                        <span className="bg-green-100 text-green-600 px-4 py-2 rounded-lg w-full text-center">
                          Mentorship Requested
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleMentorshipRequest(alum.id)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                      >
                        Request Mentorship
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredAlumni.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500">
                <p className="text-xl">No alumni found matching your criteria.</p>
                <p className="mt-2">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Upcoming Events Section */}
        <div>
          <div className="flex items-center mb-6">
            <Calendar className="h-6 w-6 text-indigo-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Upcoming Events</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredEvents.map(event => (
              <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                    <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg text-sm font-medium">
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  
                  {/* Display Alumni Organizer */}
                  {event.alumniId && (
                    <p className="text-sm text-gray-500">
                      Organized by: <span className="font-semibold">{alumni.find(alum => alum.id === event.alumniId)?.name || 'Unknown'}</span>
                    </p>
                  )}
                  
                  {/* Alumni-Organized Badge */}
                  {alumni.find(alum => alum.id === event.alumniId)?.isNotable && (
                    <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium">
                      Alumni-Organized
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-500 mt-4">
                    <span className="flex items-center">
                      <span className="mr-2">📍</span>
                      {event.location}
                    </span>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                      RSVP to Event
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredEvents.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500">
                <p className="text-xl">No upcoming events at this time.</p>
                <p className="mt-2">Check back later for new events.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
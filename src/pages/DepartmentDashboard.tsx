import React, { useState } from 'react';
import Header from '../components/Header';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, GraduationCap, Search, Trash2, Plus } from 'lucide-react';

const DepartmentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { students, alumni, events, deleteStudent, deleteAlumni, addEvent, deleteEvent } = useData();
  
  const [activeTab, setActiveTab] = useState<'students' | 'alumni' | 'events'>('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: ''
  });
  const [selectedAlumni, setSelectedAlumni] = useState('');

  // Filter students or alumni based on search term
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.department.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredAlumni = alumni.filter(alum => 
    alum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alum.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alum.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alum.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alum.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter events based on selected alumni
  const filteredEvents = events.filter(event => 
    !selectedAlumni || event.alumniId === selectedAlumni
  );
  
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent(newEvent);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      location: ''
    });
    setShowEventForm(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 mb-8">
          <h1 className="text-2xl font-bold text-blue-900 mb-2">Department Management</h1>
          <p className="text-gray-600">Manage students, alumni, and events for your department.</p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'students'
                    ? 'border-blue-600 text-blue-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors duration-200`}
                onClick={() => setActiveTab('students')}
              >
                <GraduationCap className="h-5 w-5 inline-block mr-2" />
                Students
              </button>
              
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'alumni'
                    ? 'border-blue-600 text-blue-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors duration-200`}
                onClick={() => setActiveTab('alumni')}
              >
                <Users className="h-5 w-5 inline-block mr-2" />
                Alumni
              </button>
              
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'events'
                    ? 'border-blue-600 text-blue-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors duration-200`}
                onClick={() => setActiveTab('events')}
              >
                <Calendar className="h-5 w-5 inline-block mr-2" />
                Events
              </button>
            </nav>
          </div>
        </div>
        
        {/* Search Bar */}
        {activeTab !== 'events' && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                className="w-full px-3 py-2 rounded-md focus:outline-none"
              />
            </div>
          </div>
        )}
        
        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expected Graduation
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{student.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {student.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {student.graduationYear}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => deleteStudent(student.id)}
                          className="text-red-600 hover:text-red-900 transition"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No students found. Try adjusting your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Alumni Tab */}
        {activeTab === 'alumni' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Graduation Year
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Position
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAlumni.map(alum => (
                    <tr key={alum.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{alum.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {alum.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {alum.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {alum.graduationYear}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {alum.position && alum.company 
                          ? `${alum.position} at ${alum.company}`
                          : 'Not specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => deleteAlumni(alum.id)}
                          className="text-red-600 hover:text-red-900 transition"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  
                  {filteredAlumni.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No alumni found. Try adjusting your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Events Tab */}
        {activeTab === 'events' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Manage Events</h2>
              <button
                onClick={() => setShowEventForm(!showEventForm)}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md flex items-center text-sm transition duration-150"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add New Event
              </button>
            </div>
            
            {/* Alumni Filter */}
            <div className="mb-4">
              <select
                onChange={(e) => setSelectedAlumni(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Alumni</option>
                {alumni.map(alum => (
                  <option key={alum.id} value={alum.id}>
                    {alum.name} ({alum.department})
                  </option>
                ))}
              </select>
            </div>

            {showEventForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Event</h3>
                <form onSubmit={handleAddEvent}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Event Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                        Event Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        id="description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowEventForm(false)}
                      className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition"
                    >
                      Create Event
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.length > 0 ? (
                filteredEvents.map(event => (
                  <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{event.title}</h3>
                        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{event.description}</p>
                      
                      {/* Display Alumni Organizer */}
                      {event.alumniId && (
                        <p className="text-sm text-gray-500">
                          Organized by: <span className="font-semibold">{alumni.find(alum => alum.id === event.alumniId)?.name || 'Unknown'}</span>
                          {alumni.find(alum => alum.id === event.alumniId)?.department && (
                            <span> ({alumni.find(alum => alum.id === event.alumniId)?.department})</span>
                          )}
                        </p>
                      )}
                      
                      {/* Alumni-Organized Badge */}
                      {alumni.find(alum => alum.id === event.alumniId)?.isNotable && (
                        <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-medium">
                          Alumni-Organized
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-500 mt-3">
                        <span className="mr-4">📍 {event.location}</span>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end">
                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="text-red-600 hover:text-red-900 transition flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete Event
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center text-gray-500">
                  No events have been scheduled. Use the "Add New Event" button to create one.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DepartmentDashboard;
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Building, Award, BookOpen } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { alumni, updateAlumniProfile } = useData();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    company: '',
    position: '',
    achievements: [] as string[],
    newAchievement: ''
  });
  
  // Find the current user's alumni record if they are an alumni
  useEffect(() => {
    if (user && user.role === 'alumni') {
      const alumniRecord = alumni.find(a => a.id === user.id);
      if (alumniRecord) {
        setProfileData({
          company: alumniRecord.company || '',
          position: alumniRecord.position || '',
          achievements: alumniRecord.achievements || [],
          newAchievement: ''
        });
      }
    }
  }, [user, alumni]);
  
  const handleSaveProfile = () => {
    if (user && user.role === 'alumni') {
      // Filter out empty achievement
      const achievements = profileData.achievements.filter(ach => ach.trim() !== '');
      
      updateAlumniProfile(user.id, {
        company: profileData.company,
        position: profileData.position,
        achievements
      });
      
      setIsEditing(false);
    }
  };
  
  const handleAddAchievement = () => {
    if (profileData.newAchievement.trim() !== '') {
      setProfileData({
        ...profileData,
        achievements: [...profileData.achievements, profileData.newAchievement],
        newAchievement: ''
      });
    }
  };
  
  const handleRemoveAchievement = (index: number) => {
    const updatedAchievements = [...profileData.achievements];
    updatedAchievements.splice(index, 1);
    setProfileData({
      ...profileData,
      achievements: updatedAchievements
    });
  };
  
  const alumniRecord = alumni.find(a => a.id === user?.id);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-6 py-8 text-white">
            <div className="flex flex-col sm:flex-row items-center sm:items-start">
              <div className="bg-blue-700 h-24 w-24 rounded-full flex items-center justify-center mb-4 sm:mb-0 sm:mr-6">
                <User className="h-12 w-12" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user?.name}</h1>
                <p className="text-blue-100 mt-1 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {user?.email}
                </p>
                
                {user?.role === 'student' && (
                  <div className="mt-2 inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    Student
                  </div>
                )}
                
                {user?.role === 'alumni' && (
                  <div className="mt-2 inline-block bg-teal-600 text-white text-xs px-2 py-1 rounded-full">
                    Alumni
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {user?.role === 'student' ? (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Student Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Department</h3>
                    <p className="mt-1 flex items-center text-gray-800">
                      <BookOpen className="h-4 w-4 mr-2 text-blue-900" />
                      {/* This is mockup data since we don't have actual student details */}
                      {['Computer Science', 'Engineering', 'Business', 'Arts'][Math.floor(Math.random() * 4)]}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Expected Graduation</h3>
                    <p className="mt-1 flex items-center text-gray-800">
                      <Calendar className="h-4 w-4 mr-2 text-blue-900" />
                      {/* This is mockup data */}
                      {new Date().getFullYear() + Math.floor(Math.random() * 4)}
                    </p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Students cannot edit their profiles in this demo version. After graduation, you can register as an alumni to showcase your achievements.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Alumni Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition text-sm"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition text-sm"
                    >
                      Save Changes
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Department</h3>
                    <p className="mt-1 flex items-center text-gray-800">
                      <BookOpen className="h-4 w-4 mr-2 text-blue-900" />
                      {alumniRecord?.department || 'Not specified'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Graduation Year</h3>
                    <p className="mt-1 flex items-center text-gray-800">
                      <Calendar className="h-4 w-4 mr-2 text-blue-900" />
                      {alumniRecord?.graduationYear || 'Not specified'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Company</h3>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.company}
                        onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter company name"
                      />
                    ) : (
                      <p className="mt-1 flex items-center text-gray-800">
                        <Building className="h-4 w-4 mr-2 text-blue-900" />
                        {alumniRecord?.company || 'Not specified'}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Position</h3>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.position}
                        onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your position"
                      />
                    ) : (
                      <p className="mt-1 flex items-center text-gray-800">
                        <User className="h-4 w-4 mr-2 text-blue-900" />
                        {alumniRecord?.position || 'Not specified'}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <Award className="h-5 w-5 mr-2 text-blue-900" />
                    Achievements
                  </h3>
                  
                  {isEditing ? (
                    <div>
                      <div className="flex mb-3">
                        <input
                          type="text"
                          value={profileData.newAchievement}
                          onChange={(e) => setProfileData({...profileData, newAchievement: e.target.value})}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Add a new achievement"
                        />
                        <button
                          onClick={handleAddAchievement}
                          className="px-4 py-2 bg-blue-900 text-white rounded-r-md hover:bg-blue-800 transition"
                        >
                          Add
                        </button>
                      </div>
                      
                      <ul className="space-y-2">
                        {profileData.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                            <span>{achievement}</span>
                            <button
                              onClick={() => handleRemoveAchievement(index)}
                              className="text-red-600 hover:text-red-800 transition"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                      
                      {profileData.achievements.length === 0 && (
                        <p className="text-gray-500 italic">No achievements added yet.</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      {alumniRecord?.achievements && alumniRecord.achievements.length > 0 ? (
                        <ul className="space-y-2">
                          {alumniRecord.achievements.map((achievement, index) => (
                            <li key={index} className="bg-gray-50 p-3 rounded">
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 italic">No achievements added yet.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
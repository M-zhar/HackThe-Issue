import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { createClient } from '@supabase/supabase-js';

interface Student {
  id: string;
  name: string;
  email: string;
  graduationYear: number;
  department: string;
  mentors: string[];
}

interface Alumni {
  id: string;
  name: string;
  email: string;
  graduationYear: number;
  department: string;
  company?: string;
  position?: string;
  achievements?: string[];
  isNotable?: boolean;
  mentees: string[];
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
}

interface Mentorship {
  id: string;
  studentId: string;
  alumniId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

interface DataContextType {
  students: Student[];
  alumni: Alumni[];
  events: Event[];
  deleteStudent: (id: string) => void;
  deleteAlumni: (id: string) => void;
  addEvent: (event: Omit<Event, 'id'>) => void;
  deleteEvent: (id: string) => void;
  updateAlumniProfile: (id: string, updates: Partial<Alumni>) => void;
  getNotableAlumni: () => Alumni[];
  requestMentorship: (studentId: string, alumniId: string) => void;
  getMentorships: (userId: string, role: 'student' | 'alumni') => Mentorship[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Sample data for initialization
const sampleStudents: Student[] = [
  {
    id: 'student_1',
    name: 'John Smith',
    email: 'john.smith@university.edu',
    graduationYear: 2025,
    department: 'Computer Science',
    mentors: []
  },
  {
    id: 'student_2',
    name: 'Emily Johnson',
    email: 'emily.johnson@university.edu',
    graduationYear: 2024,
    department: 'Engineering',
    mentors: []
  },
  {
    id: 'student_3',
    name: 'Michael Brown',
    email: 'michael.brown@university.edu',
    graduationYear: 2026,
    department: 'Business',
    mentors: []
  }
];

const sampleAlumni: Alumni[] = [
  {
    id: 'alumni_1',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@gmail.com',
    graduationYear: 2020,
    department: 'Computer Science',
    company: 'Google',
    position: 'Software Engineer',
    achievements: ['Published research paper', 'Led major project'],
    isNotable: true,
    mentees: []
  },
  {
    id: 'alumni_2',
    name: 'David Martinez',
    email: 'david.martinez@outlook.com',
    graduationYear: 2018,
    department: 'Engineering',
    company: 'Tesla',
    position: 'Product Manager',
    isNotable: false,
    mentees: []
  },
  {
    id: 'alumni_3',
    name: 'Jennifer Lee',
    email: 'jennifer.lee@yahoo.com',
    graduationYear: 2015,
    department: 'Business',
    company: 'Amazon',
    position: 'Marketing Director',
    achievements: ['MBA from Harvard', 'Founded startup'],
    isNotable: true,
    mentees: []
  }
];

const sampleEvents: Event[] = [
  {
    id: 'event_1',
    title: 'Annual Alumni Reunion',
    description: 'Join us for the annual alumni reunion and networking event.',
    date: '2025-06-15',
    location: 'University Main Campus'
  },
  {
    id: 'event_2',
    title: 'Career Workshop',
    description: 'Workshop on career opportunities in tech industry.',
    date: '2025-04-20',
    location: 'Virtual Event'
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [mentorships, setMentorships] = useState<Mentorship[]>([]);

  useEffect(() => {
    // Initialize data if it doesn't exist in localStorage
    if (!localStorage.getItem('students')) {
      localStorage.setItem('students', JSON.stringify(sampleStudents));
    }
    
    if (!localStorage.getItem('alumni')) {
      localStorage.setItem('alumni', JSON.stringify(sampleAlumni));
    }
    
    if (!localStorage.getItem('events')) {
      localStorage.setItem('events', JSON.stringify(sampleEvents));
    }
    
    if (!localStorage.getItem('mentorships')) {
      localStorage.setItem('mentorships', JSON.stringify([]));
    }
    
    // Load data from localStorage
    const loadStudents = localStorage.getItem('students');
    const loadAlumni = localStorage.getItem('alumni');
    const loadEvents = localStorage.getItem('events');
    const loadMentorships = localStorage.getItem('mentorships');
    
    setStudents(loadStudents ? JSON.parse(loadStudents) : []);
    setAlumni(loadAlumni ? JSON.parse(loadAlumni) : []);
    setEvents(loadEvents ? JSON.parse(loadEvents) : []);
    setMentorships(loadMentorships ? JSON.parse(loadMentorships) : []);
  }, []);

  const deleteStudent = (id: string) => {
    const updatedStudents = students.filter(student => student.id !== id);
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
  };

  const deleteAlumni = (id: string) => {
    const updatedAlumni = alumni.filter(alum => alum.id !== id);
    setAlumni(updatedAlumni);
    localStorage.setItem('alumni', JSON.stringify(updatedAlumni));
  };

  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      id: `event_${Date.now()}`,
      ...event
    };
    
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  };

  const deleteEvent = (id: string) => {
    const updatedEvents = events.filter(event => event.id !== id);
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  };

  const updateAlumniProfile = (id: string, updates: Partial<Alumni>) => {
    const updatedAlumni = alumni.map(alum => 
      alum.id === id ? { ...alum, ...updates } : alum
    );
    
    setAlumni(updatedAlumni);
    localStorage.setItem('alumni', JSON.stringify(updatedAlumni));
  };

  const getNotableAlumni = () => {
    return alumni.filter(alum => alum.isNotable === true);
  };

  const requestMentorship = (studentId: string, alumniId: string) => {
    const newMentorship: Mentorship = {
      id: `mentorship_${Date.now()}`,
      studentId,
      alumniId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    const updatedMentorships = [...mentorships, newMentorship];
    setMentorships(updatedMentorships);
    localStorage.setItem('mentorships', JSON.stringify(updatedMentorships));
    
    // Update student's mentors list
    const updatedStudents = students.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          mentors: [...student.mentors, alumniId]
        };
      }
      return student;
    });
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
    
    // Update alumni's mentees list
    const updatedAlumni = alumni.map(alum => {
      if (alum.id === alumniId) {
        return {
          ...alum,
          mentees: [...(alum.mentees || []), studentId]
        };
      }
      return alum;
    });
    setAlumni(updatedAlumni);
    localStorage.setItem('alumni', JSON.stringify(updatedAlumni));
  };

  const getMentorships = (userId: string, role: 'student' | 'alumni') => {
    return mentorships.filter(mentorship => 
      role === 'student' ? mentorship.studentId === userId : mentorship.alumniId === userId
    );
  };

  return (
    <DataContext.Provider value={{
      students,
      alumni,
      events,
      deleteStudent,
      deleteAlumni,
      addEvent,
      deleteEvent,
      updateAlumniProfile,
      getNotableAlumni,
      requestMentorship,
      getMentorships
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
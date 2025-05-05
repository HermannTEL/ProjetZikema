import { useEffect, useState } from "react";
import { useCourse, useEnrollment, useTheme, useToast } from "../../../../utils/hooks";
import { getLocalUser, getThemeClass } from "../../../../utils/functions";
import { Select, SelectItem } from "../../../../components/ui";
import { motion } from "framer-motion";
import { Users, Award, Filter, X, CheckCircle, AlertCircle, Music4Icon } from "lucide-react";

const CoursesCatalog = () => {
  const { fetchCourses } = useCourse();
  const { createEnrollment, fetchStudentEnrollments } = useEnrollment();
  const { theme } = useTheme();
  const { toast } = useToast();

  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState({ instrument: "", level: "", type: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [availableCourses, setAvailableCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Optimized data loading function
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const loggedUser = getLocalUser();
        setUser(loggedUser);
        
        // Fetch all courses
        const allCoursesResponse = await fetchCourses();
        const allCourses = allCoursesResponse.data;
        setCourses(allCourses);
        
        // If user is logged in, filter out enrolled courses
        if (loggedUser && loggedUser._id) {
          const enrollmentsResponse = await fetchStudentEnrollments(loggedUser._id);
          const enrolledCourseIds = new Set(enrollmentsResponse.data.map(e => e.course._id));
          
          // Filter out already enrolled courses in one step
          const filteredCourses = allCourses.filter(course => !enrolledCourseIds.has(course._id));
          setAvailableCourses(filteredCourses);
        } else {
          // If not logged in, show all courses
          setAvailableCourses(allCourses);
        }
      } catch (error) {
        console.error("Error loading courses:", error);
        setMessage({ 
          type: "error", 
          text: "Unable to load courses. Please try again later." 
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      if (!user || !user._id) {
        setMessage({ type: "error", text: "Please log in to enroll in courses." });
        return;
      }

      const response = await createEnrollment({
        student: user._id,
        course: courseId,
        status: "pending",
        schedules: [],
      });

      if (!response.success && response.error) {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        });
        setMessage({ type: "success", text: response.error });
        return;
      }

      if (response && response.success) {
        // Remove the enrolled course from the available courses immediately
        setAvailableCourses(prev => prev.filter(course => course._id !== courseId));
        setMessage({ type: "success", text: "Successfully enrolled in course!" });
        
        // Auto-dismiss message after 3 seconds
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({ type: "error", text: response?.error || "Error during enrollment." });
      }
    } catch (err) {
      console.error(err);
      if (err?.response?.data?.error?.includes("already enrolled")) {
        setMessage({ type: "error", text: "You are already enrolled in this course." });
      } else {
        setMessage({ type: "error", text: "An error occurred during enrollment. catch" });
      }
    }
  };

  // Extract unique values for filters
  const instruments = [...new Set(courses.map(c => c.instrument).filter(Boolean))];
  const levels = ["Débutant", "Intermédiaire", "Avancé"];
  const types = ["individual", "group", "workshop", "masterclass"];

  // Apply filters to available courses
  const filteredCourses = availableCourses.filter(c =>
    (!filter.instrument || c.instrument === filter.instrument) &&
    (!filter.level || c.level === filter.level) &&
    (!filter.type || c.type === filter.type)
  );

  // Reset all filters
  const clearFilters = () => {
    setFilter({ instrument: "", level: "", type: "" });
  };

  // Get formatted type display name
  const getTypeDisplay = (type) => {
    const typeMap = {
      "individual": "Individual",
      "group": "Group Class",
      "workshop": "Workshop",
      "masterclass": "Masterclass"
    };
    return typeMap[type] || type;
  };

  // Get status badge styling
  const getStatusBadgeClasses = (status) => {
    const baseClasses = "text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1";
    
    if (status === 'active') {
      return `${baseClasses} ${getThemeClass("bg-emerald-100 text-emerald-700", "bg-emerald-900 text-emerald-200", theme)}`;
    } else if (status === 'full') {
      return `${baseClasses} ${getThemeClass("bg-amber-100 text-amber-700", "bg-amber-900 text-amber-200", theme)}`;
    } else {
      return `${baseClasses} ${getThemeClass("bg-gray-100 text-gray-600", "bg-gray-800 text-gray-300", theme)}`;
    }
  };

  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto ${getThemeClass("bg-gray-50", "bg-gray-900", theme)}`}>
      {/* Header section with title and filter toggle */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h2 className={`${getThemeClass("text-gray-800", "text-white", theme)} text-3xl font-bold flex items-center gap-2`}>
          <Music4Icon className="w-8 h-8 text-blue-500" />
          <span>Explore Courses</span>
        </h2>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 py-2 px-4 rounded-lg ${
              getThemeClass(
                "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
                "bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-750", 
                theme
              )}`}
          >
            {showFilters ? <X size={18} /> : <Filter size={18} />}
            {showFilters ? "Hide Filters" : "Filter Courses"}
          </button>
          
          {Object.values(filter).some(Boolean) && (
            <button
              onClick={clearFilters}
              className={`flex items-center gap-1 py-2 px-3 rounded-lg text-sm ${
                getThemeClass(
                  "bg-red-50 text-red-600 hover:bg-red-100",
                  "bg-red-900 text-red-200 hover:bg-red-800", 
                  theme
                )}`}
            >
              <X size={14} />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Expandable filters section */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className={`mb-8 p-4 rounded-xl ${getThemeClass("bg-white shadow-sm", "bg-gray-800", theme)}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${getThemeClass("text-gray-700", "text-gray-300", theme)}`}>
                Instrument
              </label>
              <Select 
                value={filter.instrument} 
                onValueChange={(val) => setFilter(f => ({ ...f, instrument: val }))}
                className="w-full"
              >
                <SelectItem value="">All Instruments</SelectItem>
                {instruments.map((i, index) => (
                  <SelectItem key={index} value={i}>{i}</SelectItem>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <label className={`block text-sm font-medium ${getThemeClass("text-gray-700", "text-gray-300", theme)}`}>
                Level
              </label>
              <Select 
                value={filter.level} 
                onValueChange={(val) => setFilter(f => ({ ...f, level: val }))}
              >
                <SelectItem value="">All Levels</SelectItem>
                {levels.map((lvl, index) => (
                  <SelectItem key={index} value={lvl}>{lvl}</SelectItem>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <label className={`block text-sm font-medium ${getThemeClass("text-gray-700", "text-gray-300", theme)}`}>
                Type
              </label>
              <Select 
                value={filter.type} 
                onValueChange={(val) => setFilter(f => ({ ...f, type: val }))}
              >
                <SelectItem value="">All Types</SelectItem>
                {types.map((t, index) => (
                  <SelectItem key={index} value={t}>{getTypeDisplay(t)}</SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Status message */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success'
              ? getThemeClass("bg-green-50 text-green-700", "bg-green-900/50 text-green-200", theme)
              : getThemeClass("bg-red-50 text-red-700", "bg-red-900/50 text-red-200", theme)
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
          )}
          <p>{message.text}</p>
        </motion.div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Course grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`${getThemeClass(
                  "bg-white", 
                  "bg-gray-800 border border-gray-700", 
                  theme
                )} rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 flex flex-col`}
              >
                {course.imageUrl ? (
                  <div className="w-full h-48 overflow-hidden">
                    <img 
                      src={course.imageUrl} 
                      alt={course.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
                    />
                  </div>
                ) : (
                  <div className={`w-full h-32 flex items-center justify-center ${getThemeClass(
                    "bg-blue-50", 
                    "bg-blue-900/20", 
                    theme
                  )}`}>
                    <MusicNote size={48} className="text-blue-400" />
                  </div>
                )}
                
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-start mb-3 gap-2">
                    <span className={getStatusBadgeClasses(course.status)}>
                      {course.status === 'active' && <CheckCircle size={14} />}
                      {course.status}
                    </span>
                  </div>

                  <h3 className={`${getThemeClass("text-gray-800", "text-white", theme)} text-xl font-bold mb-2`}>
                    {course.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    {course.instrument && (
                      <span className={`text-xs px-2 py-1 rounded-full ${getThemeClass(
                        "bg-blue-50 text-blue-700", 
                        "bg-blue-900/40 text-blue-200", 
                        theme
                      )}`}>
                        <Music4Icon size={12} className="inline mr-1" /> {course.instrument}
                      </span>
                    )}
                    
                    {course.level && (
                      <span className={`text-xs px-2 py-1 rounded-full ${getThemeClass(
                        "bg-purple-50 text-purple-700", 
                        "bg-purple-900/40 text-purple-200", 
                        theme
                      )}`}>
                        <Award size={12} className="inline mr-1" /> {course.level}
                      </span>
                    )}
                    
                    {course.type && (
                      <span className={`text-xs px-2 py-1 rounded-full ${getThemeClass(
                        "bg-green-50 text-green-700", 
                        "bg-green-900/40 text-green-200", 
                        theme
                      )}`}>
                        <Users size={12} className="inline mr-1" /> {getTypeDisplay(course.type)}
                      </span>
                    )}
                  </div>
                  
                  <p className={`${getThemeClass("text-gray-600", "text-gray-300", theme)} text-sm mb-4 line-clamp-3 flex-grow`}>
                    {course.description}
                  </p>

                  <button
                    onClick={() => handleEnroll(course._id)}
                    className={`w-full mt-auto py-2.5 px-4 rounded-lg font-medium transition-all ${
                      course.status === 'full'
                        ? getThemeClass(
                            "bg-gray-100 text-gray-500 cursor-not-allowed", 
                            "bg-gray-700 text-gray-400 cursor-not-allowed", 
                            theme
                          )
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                    disabled={course.status === 'full'}
                  >
                    {course.status === 'full' ? 'Course Full' : 'Enroll Now'}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty state */}
          {filteredCourses.length === 0 && (
            <div className={`text-center py-16 ${getThemeClass("bg-white", "bg-gray-800", theme)} rounded-xl shadow-sm`}>
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                <MusicNote size={32} className="text-gray-400" />
              </div>
              <h3 className={`${getThemeClass("text-gray-800", "text-gray-200", theme)} text-lg font-medium mb-2`}>
                No courses found
              </h3>
              <p className={getThemeClass("text-gray-500", "text-gray-400", theme)}>
                Try adjusting your filters or check back later for new courses
              </p>
              {Object.values(filter).some(Boolean) && (
                <button 
                  onClick={clearFilters}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CoursesCatalog;
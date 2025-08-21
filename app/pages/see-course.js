import { useCourses } from "../context/CoursesContext";

export default function SeeCourse() {
  const { courses } = useCourses();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-lg w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-6 text-white text-center">All Courses</h1>
        {courses.length === 0 ? (
          <p className="text-gray-300 text-center">No courses created yet.</p>
        ) : (
          <ul className="space-y-4">
            {courses.map((course, index) => (
              <li key={index} className="bg-gray-900 rounded p-4 border border-gray-700">
                <div className="text-lg font-semibold text-white mb-1">{course.name}</div>
                <div className="text-gray-300 mb-2">{course.details}</div>
                <div className="text-sm text-blue-400">Instructor: {course.instructor}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

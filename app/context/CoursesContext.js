import { createContext, useState, useContext } from "react";

const CoursesContext = createContext();

export function CoursesProvider({ children }) {
  const [courses, setCourses] = useState([]);

  const addCourse = (course) => {
    setCourses((prev) => [...prev, course]);
  };

  return (
    <CoursesContext.Provider value={{ courses, addCourse }}>
      {children}
    </CoursesContext.Provider>
  );
}

export function useCourses() {
  return useContext(CoursesContext);
}

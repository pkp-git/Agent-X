import { useState } from "react";
import { useCourses } from "../context/CoursesContext";
import { useRouter } from "next/router";

export default function CreateCourse() {
  const { addCourse } = useCourses();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    details: "",
    instructor: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addCourse(formData);
    router.push("/see-course"); // redirect to course list
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-gray-800 py-8 px-2">
      <div className="w-full max-w-lg bg-gray-800/90 p-10 rounded-2xl shadow-2xl border border-gray-700 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-white tracking-tight">Create a New Course</h1>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          <div>
            <label className="block mb-2 text-gray-300 font-semibold">Course Name</label>
            <input
              id="courseName"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-900 text-white border-2 border-gray-600 focus:border-blue-500 rounded-lg outline-none transition"
              placeholder="Enter course name"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-300 font-semibold">Course Details</label>
            <textarea
              id="courseDetails"
              name="details"
              value={formData.details}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-900 text-white border-2 border-gray-600 focus:border-blue-500 rounded-lg outline-none transition min-h-[100px]"
              placeholder="Enter course details"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-300 font-semibold">Instructor</label>
            <input
              id="instructor"
              type="text"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-900 text-white border-2 border-gray-600 focus:border-blue-500 rounded-lg outline-none transition"
              placeholder="Enter instructor name"
            />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-bold py-3 rounded-lg shadow-lg transition text-lg tracking-wide">Create Course</button>
        </form>
      </div>
    </div>
  );
}

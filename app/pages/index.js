import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4 text-white">Welcome to Course Manager</h1>
        <p className="mb-8 text-gray-300">Select an option:</p>
        <div className="flex flex-col gap-4">
          <Link href="/see-course">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition">See Courses</button>
          </Link>
          <Link href="/create-course">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition">Create Course</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

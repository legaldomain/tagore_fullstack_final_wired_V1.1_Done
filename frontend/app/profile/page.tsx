'use client';

import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [writingName, setWritingName] = useState("");

  useEffect(() => {
    // Load profile data from localStorage on mount
    const savedProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    if (savedProfile) {
      setUsername(savedProfile.username || "");
      setBio(savedProfile.bio || "");
      setWritingName(savedProfile.writingName || "");
    }
  }, []);

  const handleSave = () => {
    const profile = { username, bio, writingName };
    localStorage.setItem("userProfile", JSON.stringify(profile));
    alert("Profile saved successfully!");
  };

  return (
    <div className="flex flex-col items-center p-12 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-8">User Profile Settings</h1>

      {/* Username */}
      <div className="w-full max-w-2xl mb-6">
        <label htmlFor="username" className="block text-base font-medium text-gray-700 mb-2">
          Username / Pen Name
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="w-full rounded-lg border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 text-sm p-3"
        />
      </div>

      {/* Bio */}
      <div className="w-full max-w-2xl mb-6">
        <label htmlFor="bio" className="block text-base font-medium text-gray-700 mb-2">
          Bio / About Me
        </label>
        <textarea
          id="bio"
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Write a short bio about yourself"
          className="w-full rounded-lg border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 text-sm p-3"
        ></textarea>
      </div>

      {/* Preferred Writing Name */}
      <div className="w-full max-w-2xl mb-6">
        <label htmlFor="writing-name" className="block text-base font-medium text-gray-700 mb-2">
          Preferred Writing Name
        </label>
        <input
          id="writing-name"
          type="text"
          value={writingName}
          onChange={(e) => setWritingName(e.target.value)}
          placeholder="Enter your author name for exports"
          className="w-full rounded-lg border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 text-sm p-3"
        />
      </div>

      <button
        onClick={handleSave}
        className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm"
      >
        Save Changes
      </button>
    </div>
  );
}
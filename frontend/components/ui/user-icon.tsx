import { useState, useEffect } from "react";

export default function UserIcon() {
  const [initial, setInitial] = useState(null);

  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    if (savedProfile && savedProfile.username) {
      setInitial(savedProfile.username.charAt(0).toUpperCase());
    } else {
      setInitial(null);
    }
  }, []);

  if (!initial) return null;

  return (
    <div className="ml-2 h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
      {initial}
    </div>
  );
}
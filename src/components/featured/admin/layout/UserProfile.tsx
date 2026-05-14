import { User } from "lucide-react";

export default function UserProfile() {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-gray-100 p-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200">
        <User size={18} />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900">
          Admin User
        </h3>

        <p className="text-xs text-gray-500">
          admin@example.com
        </p>
      </div>
    </div>
  );
}
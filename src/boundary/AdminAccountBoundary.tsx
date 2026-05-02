import { AdminLayoutBoundary } from "@/boundary/AdminLayoutBoundary";
import { createUserAccount } from "@/controller/authActions";
import type { UserAccountDTO } from "@/entity/UserAccount";
import type { UserProfileDTO } from "@/entity/UserProfile";

export function AdminAccountBoundary({
  account,
  profiles,
}: {
  account: UserAccountDTO;
  profiles: UserProfileDTO[];
}) {
  return (
    <AdminLayoutBoundary account={account} eyebrow="Admin Account" title="Create User Account">
      <form
        action={createUserAccount}
        className="mt-8 max-w-xl rounded-lg border border-[#f0d8bd] bg-[#fffaf5] p-5 shadow-sm"
      >
        <div className="grid gap-4">
          <Field label="Username" name="username" placeholder="jane_admin" />
          <Field label="Email" name="email" type="email" placeholder="name@example.com" />
          <Field label="Temporary Password" name="password" type="password" placeholder="Password" />
          <label className="block text-sm font-medium">
            Profile
            <select
              name="profileId"
              className="mt-2 h-11 w-full rounded-md border border-[#cfc7b5] bg-white px-3 text-sm outline-none transition focus:border-[#FFB347] focus:ring-2 focus:ring-[#FFB347]/30"
            >
              {profiles.map((profile) => (
                <option key={profile.profileId} value={profile.profileId}>
                  {profile.profile}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button className="mt-5 h-11 w-full rounded-md bg-[#FFB347] px-4 text-sm font-semibold text-white transition hover:bg-[#FFBE5C]">
          Create Account
        </button>
      </form>
    </AdminLayoutBoundary>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        name={name}
        type={type}
        className="mt-2 h-11 w-full rounded-md border border-[#cfc7b5] px-3 text-sm outline-none transition focus:border-[#FFB347] focus:ring-2 focus:ring-[#FFB347]/30"
        placeholder={placeholder}
      />
    </label>
  );
}

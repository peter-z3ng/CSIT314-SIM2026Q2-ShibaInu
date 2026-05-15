"use client";

import Link from "next/link";
import { useState } from "react";
import { RouteController } from "@/controller/RouteController";
import { updateProfileAction } from "@/controller/updateProfileAction";
import type { UserAccountDTO } from "@/entity/UserAccount";

export function ProfileSidePanel({
  account,
  onClose,
}: {
  account: UserAccountDTO;
  onClose: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  const [username, setUsername] = useState(account.username);
  const [fullName, setFullName] = useState(account.fullName ?? "");
  const [email, setEmail] = useState(account.email);
  const [gender, setGender] = useState(account.gender ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(
    account.dateOfBirth ? account.dateOfBirth.slice(0, 10) : "",
  );
  const [bio, setBio] = useState(account.bio ?? "");
  const [message, setMessage] = useState("");

  async function handleSave() {
    try {
      await updateProfileAction({
        userId: account.userId,
        username,
        fullName,
        email,
        gender,
        dateOfBirth,
        bio,
      });

      setMessage("Profile updated successfully.");
      setIsEditing(false);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to update profile.",
      );
    }
  }

  return (
    <aside className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-[#fffaf5] p-6 shadow-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Profile</h2>

        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-[#f0c48a] px-3 py-1.5 text-sm font-semibold text-[#9b5d12] transition hover:bg-[#fff2df]"
        >
          Close
        </button>
      </div>

      <div className="mt-6 rounded-3xl border border-[#f0d8bd] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-[#00401A] bg-[#fffaf5] text-2xl font-bold text-[#00401A]">
            {username.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9b5d12]">
              {account.profile.profile}
            </p>

            <h3 className="mt-1 truncate text-2xl font-bold">{username}</h3>

            <p className="mt-1 truncate text-sm text-[#6f6258]">{email}</p>
          </div>
        </div>

        <div className="mt-5 border-t border-[#f0d8bd] pt-5">
          {isEditing ? (
            <div className="grid gap-4">
              <ProfileField label="Username">
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="mt-2 w-full rounded-md border border-[#f0d8bd] px-4 py-3 text-sm font-semibold outline-none focus:border-[#FFB347]"
                />
              </ProfileField>

              <ProfileField label="Full Name">
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="mt-2 w-full rounded-md border border-[#f0d8bd] px-4 py-3 text-sm font-semibold outline-none focus:border-[#FFB347]"
                />
              </ProfileField>

              <ProfileField label="Email">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-md border border-[#f0d8bd] px-4 py-3 text-sm font-semibold outline-none focus:border-[#FFB347]"
                />
              </ProfileField>

              <ProfileField label="Gender">
                <select
                  value={gender}
                  onChange={(event) => setGender(event.target.value)}
                  className="mt-2 w-full rounded-md border border-[#f0d8bd] bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#FFB347]"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </ProfileField>

              <ProfileField label="Date of Birth">
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(event) => setDateOfBirth(event.target.value)}
                  className="mt-2 w-full rounded-md border border-[#f0d8bd] px-4 py-3 text-sm font-semibold outline-none focus:border-[#FFB347]"
                />
              </ProfileField>

              <ProfileField label="Bio">
                <textarea
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  className="mt-2 min-h-[90px] w-full rounded-md border border-[#f0d8bd] px-4 py-3 text-sm font-semibold outline-none focus:border-[#FFB347]"
                />
              </ProfileField>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex h-11 flex-1 items-center justify-center rounded-md border border-[#f0c48a] bg-[#9b5d12] text-white font-bold text-[#9b5d12] transition hover:bg-[#fff2df]"
                >
                  Save
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex h-11 flex-1 items-center justify-center rounded-md border border-[#f0d8bd] bg-white text-sm font-bold text-[#9b5d12] transition hover:bg-[#fff2df]"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              <ProfileInfo label="Username" value={username} />
              <ProfileInfo
                label="Full Name"
                value={fullName || "Not added"}
              />
              <ProfileInfo label="Email" value={email} />
              <ProfileInfo label="Gender" value={formatValue(gender)} />
              <ProfileInfo
                label="Date of Birth"
                value={dateOfBirth || "Not added"}
              />
              <ProfileInfo label="Bio" value={bio || "No bio added yet."} />

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex h-11 flex-1 items-center justify-center rounded-md border border-[#f0c48a] bg-[#9b5d12] text-white font-bold text-[#9b5d12] transition hover:bg-[#fff2df]"
              >
                Edit Profile
              </button>
            </div>
          )}

          {message ? (
            <p className="mt-4 text-sm font-semibold text-[#9b5d12]">
              {message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-auto border-t border-[#f0d8bd] pt-4">
        <Link
          href={RouteController.getLogoutPath(account.profile)}
          className="flex h-11 w-full items-center justify-center rounded-md bg-[#FFB347] text-sm font-semibold text-white transition hover:bg-[#FFBE5C]"
        >
          Log Out
        </Link>
      </div>
    </aside>
  );
}

function ProfileField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#9b5d12]">
        {label}
      </p>
      {children}
    </label>
  );
}

function ProfileInfo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#9b5d12]">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold text-[#1d2520]">
        {value}
      </p>
    </div>
  );
}

function formatValue(value: string) {
  if (!value) {
    return "Not added";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}
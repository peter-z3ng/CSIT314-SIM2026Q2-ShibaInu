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
      <div className="flex items-center justify-between gap-4">
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
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#00401A] bg-[#fffaf5] text-2xl font-bold text-[#00401A]">
            {username.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9b5d12]">
              {account.profile.profile}
            </p>

            <h3 className="mt-1 text-2xl font-bold">{username}</h3>

            <p className="mt-1 text-sm text-[#6f6258]">{account.email}</p>
          </div>
        </div>

        <div className="mt-6 border-t border-[#f0d8bd] pt-5">
          {isEditing ? (
            <div className="grid gap-4">
              <Field label="Username">
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="mt-2 w-full rounded-md border border-[#f0d8bd] px-4 py-3 outline-none focus:border-[#FFB347]"
                />
              </Field>

              <Field label="Gender">
                <select
                  value={gender}
                  onChange={(event) => setGender(event.target.value)}
                  className="mt-2 w-full rounded-md border border-[#f0d8bd] bg-white px-4 py-3 outline-none focus:border-[#FFB347]"
                >
                  <option value="">Not added</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </Field>

              <Field label="Date of Birth">
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(event) => setDateOfBirth(event.target.value)}
                  className="mt-2 w-full rounded-md border border-[#f0d8bd] px-4 py-3 outline-none focus:border-[#FFB347]"
                />
              </Field>

              <Field label="Bio">
                <textarea
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  className="mt-2 min-h-[100px] w-full rounded-md border border-[#f0d8bd] px-4 py-3 outline-none focus:border-[#FFB347]"
                />
              </Field>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex h-11 flex-1 items-center justify-center rounded-md bg-[#FFB347] px-4 text-sm font-bold text-white transition hover:bg-[#FFBE5C]"
                >
                  Save
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex h-11 flex-1 items-center justify-center rounded-md border border-[#f0d8bd] bg-white px-4 text-sm font-bold text-[#9b5d12] transition hover:bg-[#fff2df]"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              <ProfileRow label="Username" value={username} />
              <ProfileRow label="Profile" value={account.profile.profile} />
              <ProfileRow label="Email" value={account.email} />
              <ProfileRow label="Gender" value={formatValue(gender)} />
              <ProfileRow
                label="Date of Birth"
                value={dateOfBirth || "Not added"}
              />
              <ProfileRow label="Bio" value={bio || "No bio added yet."} />

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="mt-2 flex h-11 w-full items-center justify-center rounded-md border border-[#f0d8bd] bg-white px-4 text-sm font-bold text-[#9b5d12] transition hover:bg-[#fff2df]"
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
          className="flex h-11 w-full items-center justify-center rounded-md bg-[#FFB347] px-4 text-sm font-semibold text-white transition hover:bg-[#FFBE5C]"
        >
          Log Out
        </Link>
      </div>
    </aside>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="text-sm font-semibold text-[#1d2520]">
      {label}
      {children}
    </label>
  );
}

function ProfileRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#9b5d12]">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#1d2520]">{value}</p>
    </div>
  );
}

function formatValue(value: string) {
  if (!value) {
    return "Not added";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}
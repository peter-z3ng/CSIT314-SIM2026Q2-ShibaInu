import { approveRegistrationRequest, rejectRegistrationRequest } from "@/controller/authActions";
import type { RegistrationRequestRecord } from "@/entity/RegistrationRequest";
import { getRoleLabel, type UserProfile } from "@/entity/UserAccount";

export function AdminDashboardBoundary({
  profile,
  requests,
}: {
  profile: UserProfile;
  requests: RegistrationRequestRecord[];
}) {
  return (
    <section className="mt-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-bold">Registration Requests</h2>
          <p className="mt-1 text-sm text-[#586158]">
            Signed in as {profile.username}. Approving a request creates the Supabase Auth account
            and the user profile.
          </p>
        </div>
        <p className="rounded-md bg-[#e7efe8] px-3 py-2 text-sm font-semibold text-[#1f5a46]">
          {requests.length} pending
        </p>
      </div>

      <div className="mt-5 grid gap-4">
        {requests.length ? (
          requests.map((request) => (
            <article
              key={request.id}
              className="rounded-lg border border-[#dfdacd] bg-[#fffdf8] p-5 shadow-sm"
            >
              <div className="grid gap-4 lg:grid-cols-[1fr_360px] lg:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a5a2f]">
                    {getRoleLabel(request.requestedRole)}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">{request.username}</h3>
                  <p className="mt-1 text-sm text-[#586158]">{request.email}</p>
                  <p className="mt-3 text-xs text-[#6d756e]">
                    Requested {new Date(request.createdAt).toLocaleDateString("en-SG")}
                  </p>
                </div>

                <div className="grid gap-3">
                  <form action={approveRegistrationRequest} className="grid gap-3 sm:grid-cols-[1fr_auto]">
                    <input type="hidden" name="requestId" value={request.id} />
                    <input
                      name="temporaryPassword"
                      type="password"
                      minLength={6}
                      placeholder="Temporary password"
                      className="h-11 rounded-md border border-[#cfc7b5] px-3 text-sm outline-none transition focus:border-[#1f5a46] focus:ring-2 focus:ring-[#1f5a46]/20"
                    />
                    <button className="h-11 rounded-md bg-[#1f5a46] px-4 text-sm font-semibold text-white transition hover:bg-[#174435]">
                      Approve
                    </button>
                  </form>
                  <form action={rejectRegistrationRequest}>
                    <input type="hidden" name="requestId" value={request.id} />
                    <button className="h-10 w-full rounded-md border border-[#cfc7b5] px-4 text-sm font-semibold text-[#7d3f24] transition hover:bg-[#f1e7d7]">
                      Reject
                    </button>
                  </form>
                </div>
              </div>
            </article>
          ))
        ) : (
          <article className="rounded-lg border border-[#dfdacd] bg-[#fffdf8] p-8 text-center shadow-sm">
            <h3 className="text-xl font-semibold">No pending requests</h3>
            <p className="mt-2 text-sm text-[#586158]">New account requests will appear here.</p>
          </article>
        )}
      </div>
    </section>
  );
}

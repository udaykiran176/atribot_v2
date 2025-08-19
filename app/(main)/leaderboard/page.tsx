import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getLeaderboardTop, getUserRank } from "@/db/queries";

export default async function LeaderboardPage() {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  const userId = (session as any)?.user?.id as string | undefined;

  const [top, userRank] = await Promise.all([
    getLeaderboardTop(10),
    userId ? getUserRank(userId) : Promise.resolve(null),
  ]);

  const inTopIdx = userId ? top.findIndex((u) => u.userId === userId) : -1;

  return (
    <div className="mx-auto max-w-2xl w-full py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      <ol className="space-y-3">
        {top.map((u, idx) => (
          <li key={u.userId} className="flex items-center justify-between bg-white p-4 rounded-md shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 font-semibold">
                {idx + 1}
              </div>
              <img src={u.userImageSrc || "/mascot.svg"} alt={u.userName || "User"} className="w-8 h-8 rounded-full object-cover" />
              <span className="font-medium">{u.userName || "User"}</span>
            </div>
            <div className="text-blue-600 font-bold">{u.points} xp</div>
          </li>
        ))}
      </ol>

      <div className="mt-8 p-4 bg-gray-50 rounded-md border">
        {userId && (userRank || inTopIdx !== -1) ? (
          <div className="flex items-center justify-between">
            <div className="font-medium">Your Position</div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                #{inTopIdx !== -1 ? inTopIdx + 1 : userRank?.rank}
              </span>
              <span className="text-gray-700">{userRank?.points ?? top[inTopIdx]?.points ?? 0} pts</span>
            </div>
          </div>
        ) : (
          <div className="text-gray-600">Sign in to see your rank.</div>
        )}
      </div>
    </div>
  );
}
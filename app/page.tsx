import JoinALeagueCard from "./components/JoinALeagueCard";
import CreateALeagueCard from "./components/CreateALeagueCard";

export default function Home() {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content">
        <div className="max-w-4xl">
          <div className="text-center">
            <h1 className="text-5xl font-bold">Step up to the plate!</h1>
            <p className="py-6">
              Think you've got what it takes to build the ultimate fantasy
              baseball team? Join the league and prove it!
            </p>
          </div>
          <div className="flex flex-row gap-10 justify-center">
            <CreateALeagueCard />
            <JoinALeagueCard />
          </div>
        </div>
      </div>
    </div>
  );
}

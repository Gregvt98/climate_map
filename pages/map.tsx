import Map from "@/components/map";
import Navbar from "@/components/navbar";

export default function mapPage() {
  return (
    <>
      <div className="flex">
        <Navbar />
        <main className="w-full">{/* Your main content goes here */}
        <Map />
        </main>
      </div>
    </>
  );
}

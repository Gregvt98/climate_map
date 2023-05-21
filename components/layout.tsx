import Header from "./header";
 
export default function Layout({ children }) {
  return (
    <>
      <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-grow">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
    </>
  );
}
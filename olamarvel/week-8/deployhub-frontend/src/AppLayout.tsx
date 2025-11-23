import Navbar from "./components/Navbar";
import { UserProvider } from "./context/user";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <UserProvider>
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans text-black">
        <main className="min-h-screen w-full max-w-3xl  bg-white sm:items-start">
          <Navbar />
          {children}
        </main>
      </div>

    </UserProvider>
  );
};

export default AppLayout;
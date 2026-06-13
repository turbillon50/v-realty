import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <SignIn />
    </div>
  );
}

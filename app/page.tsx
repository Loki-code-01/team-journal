// import { DeployButton } from "@/components/deploy-button";
// import { EnvVarWarning } from "@/components/env-var-warning";
// import { AuthButton } from "@/components/auth-button";
// import { LoginForm } from "@/components/login-form";
// import { ThemeSwitcher } from "@/components/theme-switcher";
// import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
// import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
// import { hasEnvVars } from "@/lib/utils";
// import Link from "next/link";

// export default function Home() {
//   return (
//     <main className="min-h-screen flex flex-col items-center">
//       <div className="flex-1 w-full flex flex-col gap-20 items-center">
//         <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
//           <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
//             Team Journal
//           </div>
//         </nav>
//         <div >
          
//           <main className="flex-1 flex flex-col gap-6 px-4">
//             <LoginForm/>
//           </main>
//         </div>

//       </div>
//     </main>
//   );
// }



import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/auth/login'); // This will redirect to /login on initial load
}
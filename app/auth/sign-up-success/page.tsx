'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";

export default function Page() {
  const router = useRouter();

  const redirectToGmail = () => {
    window.open(
  'https://mail.google.com/', 
  '_blank',                   
  'noopener,noreferrer'       
);

  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Thank you for signing up!
              </CardTitle>
              <CardDescription>Check your email to confirm</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You&apos;ve successfully signed up. Please check your email to
                confirm your account before signing in.
              </p>
              <p className="text-sm text-muted-foreground">
                Click to redirect to Gmail
              </p>
              <button
                onClick={redirectToGmail}
                type="button"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
              >
                Open Gmail
                <Mail size={16} />
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}